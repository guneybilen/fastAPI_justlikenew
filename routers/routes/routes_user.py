from schemas.user import ShowUser, SecurityEnum, UserCreate, UserPreCreate, UserPreCreateShow
from schemas.user import SecurityEnum
from fastapi import APIRouter, Depends
from db.session import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status, Form, Security
from core.communication import communicate_for_forgotten_password
from core.communication import pre_create_new_user_communication
from core.security import get_current_user_from_token, get_current_active_user
from db.session import get_db
from db.repository.user import create_new_user
from fastapi.responses import RedirectResponse, JSONResponse
from starlette.requests import Request
from sqlalchemy.orm import Session
from fastapi import FastAPI
# from fastapi.responses import HTMLResponse
from email_validator import validate_email, EmailNotValidError
from schemas.user import ShowUser, UserResponse
from typing import Optional
import json


router = APIRouter()

app = FastAPI()

@router.post("/precreate")
async def pre_create_user(user: UserPreCreate, db: Session = Depends(get_db)):
  user = await pre_create_new_user_communication(user=user, db=db)
  if user == False:
     return {"result": "this email is found in database. please, enroll with another email."}
  else:
     return {"result": "please, check your email inbox for completing your signup procedure..."}



@router.get("/signup/{access_token}", response_model = UserPreCreateShow)
def check_user(access_token: str, db: Session = Depends(get_db)):
  current_user = get_current_user_from_token(access_token, db)
  app.state.current_user = current_user
  return RedirectResponse("/users/create_procedure", status_code=status.HTTP_302_FOUND)


@router.get("/create_procedure")
def create_procedure():
  return {"email":  app.state.current_user}


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


# @router.get("/user_create", response_class=HTMLResponse)
# def create_user():

#   return f"""
#        <form method="POST" enctype="application/x-www-form-urlencoded" action="/users/completing_user_create">

#           <p>
#           <label>First Name
#           <input type="text" name="first_name" required>
#           </label> 
#           </p>

#           <p>
#           <label>Last Name
#           <input type="text" name="last_name" required>
#           </label> 
#           </p>

#           <p>
#           <label>Username
#           <input type="text" name="username" required>
#           </label> 
#           </p>

#           <p>
#           <label>Email 
#           <input type="email" name="email" value="{app.state.current_user}">
#           </label>
#           </p>

#           <p>
#           <label>Password 
#           <input type="password" name="password">
#           </label>
#           </p>

#           <fieldset>
#           <legend>ENTER THE ONE AND ONLY ONE EXACTLY TO THE TEXTBOX BESIDE THE LABEL, PLEASE</legend>
#               <p><label> FAVORITE_PET <input type="text" name="s_name"> </label></p>
#               <p><label> BORN_CITY <input type="text" name="s_name"> </label></p>
#               <p><label> MOTHER_MAIDEN_NAME <input type="text" name="s_name"> </label></p>
#               <p><label> GRADUATED_HIGH_SCHOOL_NAME <input type="text" name="s_name"> </label></p>
#               <p><label> FIRST_CAR <input type="text" name="s_name"> </label></p>
#               <p><label> FAVORITE_FOOD <input type="text" name="s_name"> </label></p>
#           </fieldset>

#           <p>
#           <label>Secret Answer 
#           <input type="text" name="s_answer">
#           </label>
#           </p>

#           <p><button>Submit</button></p>
#           </form>
#   """


@router.post("/user_create", response_model=UserResponse)
async def post_user_create(data: UserCreate, db: Session = Depends(get_db)):

                user = {
                  "username": data.username,
                  "first_name": data.first_name,
                  "last_name": data.last_name,
                  "email": data.email,
                  "password": data.password,
                  "security_answer": data.security_answer,
                  "security_name": data.security_name,
                }

                # casted_for_list = list(data.security_name)

                returned_user = await create_new_user(user, current_user = user, db=db,)
                
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


@router.get("/security_questions")
async def security_questions():
    return {"BORN_CITY": SecurityEnum.BORN_CITY, 
            "FAVORITE_PET": SecurityEnum.FAVORITE_PET, 
            "MOTHER_MAIDEN_NAME": SecurityEnum.MOTHER_MAIDEN_NAME,
            "GRADUATED_HIGH_SCHOOL_NAME": SecurityEnum.GRADUATED_HIGH_SCHOOL_NAME,
            "FIRST_CAR": SecurityEnum.FIRST_CAR,
            "FAVORITE_FOOD": SecurityEnum.FAVORITE_FOOD,
            }

