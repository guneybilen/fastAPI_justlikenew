from schemas.users import ShowUser, SecurityEnum, UserPreCreate, Response, UserPreCreateShow
from fastapi import APIRouter, Depends
from db.session import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status, Form, Security
from routers.utils import OAuth2PasswordBearerWithCookie
from core.communication import communicate_for_forgotten_password
from core.communication import pre_create_new_user_communication
from core.security import get_current_user_from_token, get_current_active_user
from db.session import get_db
from db.repository.users import create_new_user
from fastapi.responses import RedirectResponse
from starlette.requests import Request
from sqlalchemy.orm import Session
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from email_validator import validate_email, EmailNotValidError
from schemas.users import ShowUser


router = APIRouter()

app = FastAPI()

@router.post("/precreate", response_model=ShowUser)
async def pre_create_user(user: UserPreCreate):
  user = await pre_create_new_user_communication(user=user)
  return {"user": user, "result": "please check your email inbox for completing your signup procedure..."}


@router.get("/signup/{access_token}", response_model = UserPreCreateShow)
def check_user(access_token: str, request: Request, db: Session = Depends(get_db)):
  current_user = get_current_user_from_token(access_token, db)
  app.state.current_user = current_user
  # return {"email": current_user}
  return RedirectResponse("/users/user_create", status_code=status.HTTP_302_FOUND)

@router.post("/forgot_password_request_email/")
async def forgot_password(user: UserPreCreate):
  
  try:
    # Validate & take the normalized form of the email
    # address for all logic beyond this point (especially
    # before going to a database query where equality
    # does not take into account normalization).

    email = validate_email(user.email).email
    returned_boolean_result = await communicate_for_forgotten_password(email)
    print(returned_boolean_result)
    if returned_boolean_result:  
      return {"detail": "if there is an account associated with that email we will email a link for resetting your password"}

  except EmailNotValidError as e:
    # email is not valid, exception message is human-readable
    print(str(e))
  raise HTTPException(status_code= status.HTTP_500_INTERNAL_SERVER_ERROR, detail= "Network problem occured")  


@router.get("/forgot_password_request_accept/{access_token}", response_model=ShowUser)
def forgot_password_request_accept(access_token: str, db: Session = Depends(get_db)):
  returned_user =  get_current_user_from_token(access_token=access_token, db=db)
  print(returned_user)

  return {  "email":returned_user.email,
            "username":returned_user.username,
            "is_active": returned_user.is_active,
            "result":"forgot password reset will complete after you set up a new password from the reactjs front end form"
         }


@router.get("/user_create", response_class=HTMLResponse)
def create_user():

  return f"""
       <form method="POST" enctype="application/x-www-form-urlencoded" action="/users/completing_user_create">

          <p>
          <label>First Name
          <input type="text" name="first_name" required>
          </label> 
          </p>

          <p>
          <label>Last Name
          <input type="text" name="last_name" required>
          </label> 
          </p>

          <p>
          <label>Username
          <input type="text" name="username" required>
          </label> 
          </p>

          <p>
          <label>Email 
          <input type="email" name="email" value="{app.state.current_user}">
          </label>
          </p>

          <p>
          <label>Password 
          <input type="password" name="password">
          </label>
          </p>

          <fieldset>
          <legend>ENTER THE ONE AND ONLY ONE EXACTLY TO THE TEXTBOX BESIDE THE LABEL, PLEASE</legend>
              <p><label> FAVORITE_PET <input type="text" name="s_name"> </label></p>
              <p><label> BORN_CITY <input type="text" name="s_name"> </label></p>
              <p><label> MOTHER_MAIDEN_NAME <input type="text" name="s_name"> </label></p>
              <p><label> GRADUATED_HIGH_SCHOOL_NAME <input type="text" name="s_name"> </label></p>
              <p><label> FIRST_CAR <input type="text" name="s_name"> </label></p>
              <p><label> FAVORITE_FOOD <input type="text" name="s_name"> </label></p>
          </fieldset>

          <p>
          <label>Secret Answer 
          <input type="text" name="s_answer">
          </label>
          </p>

          <p><button>Submit</button></p>
          </form>
  """


@router.post("/completing_user_create", response_model=Response)
async def create_user(
                s_name: str = SecurityEnum,
                username: str = Form(...), 
                password: str = Form(...),
                first_name: str = Form(...),
                last_name: str = Form(...),
                email: str = Form(...),
                s_answer: str = Form(...),
                db: Session = Depends(get_db)):

                user = {
                  "username": username,
                  "first_name": first_name,
                  "last_name": last_name,
                  "email": email,
                  "password": password,
                  "s_answer": s_answer
                }

                casted_for_list = list(s_name)

                returned_user = await create_new_user(user, casted_for_list, current_user = {app.state.current_user}, db=db,)
                
                return {"email": returned_user.email, "result": "user has been signed up copmpletely"}


@router.get("/users/me/", response_model=ShowUser)
async def read_users_me(current_user: ShowUser = Depends(get_current_active_user)):
    return current_user


@router.get("/users/me/items/")
async def read_own_items(
    current_user: ShowUser = Security(get_current_active_user, scopes=["items"])
):
    return [{"item_id": "Foo", "owner": current_user.username}]


@router.get("/status/")
async def read_system_status(current_user: ShowUser = Depends(get_current_user_from_token)):
    return {"status": "ok"}