from schemas.user import ShowUser, SecurityEnum, UserCreate, UserPreCreate, UserUpdate
from schemas.user import SecurityEnum
from fastapi import APIRouter, Depends, Form
from db.session import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
from core.communication import communicate_for_forgotten_password
from core.communication import email_confirmation_communication
from core.security import get_current_user_from_token, get_current_user_from_token_during_signup, create_acess_token_and_create_limit_table_entry
from db.session import get_db
from db.repository.user import create_new_user, update_user, update_email
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from fastapi import FastAPI, Request
from email_validator import validate_email, EmailNotValidError
from schemas.user import ShowUser, UserResponse
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from pathlib import Path
import os as _os
from core.security import logout_user


env_path = Path(".") / ".env"
load_dotenv(dotenv_path = env_path)

router = APIRouter()

app = FastAPI()


@router.post("/precreate")
async def pre_create_user(user: UserPreCreate, db: Session = Depends(get_db)):
  user = await email_confirmation_communication(user=user, db=db)
  if user == False:
     return {"result": "this email is found in the database. <br />please, enroll with another email."}
  else:
     return {"result": "please, check your email inbox <br />for completing your signup procedure..."}


@router.get("/signup/{access_token}", response_class=RedirectResponse)
async def check_user(access_token: str, db: Session = Depends(get_db)):
  current_user = await get_current_user_from_token_during_signup(access_token, db)
  try:
    if (current_user == "expired_access_token_during_signup"):
      raise AttributeError
    app.state.current_user = current_user
    return RedirectResponse(f"{_os.getenv('FRONT_END_URL')}/signup", status_code=status.HTTP_302_FOUND)
  except AttributeError as e:
    return RedirectResponse(f"{_os.getenv('FRONT_END_URL')}/Error", status_code=status.HTTP_302_FOUND)


@router.get("/create_procedure")
async def create_procedure():
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
async def forgot_password_request_accept(access_token: str, db: Session = Depends(get_db)):
  returned_user =  await get_current_user_from_token(access_token=access_token, db=db)

  return {  "email":returned_user.email,
            "username":returned_user.username,
            "is_active": returned_user.is_active,
            "result":"forgot password reset will complete after you set up a new password from the reactjs front end form"
         }


@router.post("/user_create", response_model=UserResponse)
async def post_user_create(data: UserCreate, db: Session = Depends(get_db)):

            if data.password != data.password_confirm:
              return {"result": "password and password confirmation boxes do not match."}

            else: 

              user = {
                "username": data.username,
                "first_name": data.first_name,
                "last_name": data.last_name,
                "email": data.email,
                "password": data.password,
                "security_answer": data.security_answer,
                "security_name": data.security_name,
              }

              try:
                returned_user_or_error = await create_new_user(user=user, db=db)
                #print(returned_user_or_error.email)
                #print(returned_user_or_error.id)
                access_token = create_acess_token_and_create_limit_table_entry(user= returned_user_or_error.email, db=db, id= returned_user_or_error.id)
                return {"username": returned_user_or_error.username, 
                        "access_token": access_token,
                        "result": "Signing up completed. Please, click on a link."}
              except AttributeError as e:
                print(e)
                return {"result": "email or username is present errror on server"}     

           
@router.patch("/update_user", response_model=UserResponse)
async def patch_user(
                      req: Request,
                      data: UserUpdate,
                      db: Session = Depends(get_db)
                    ):

            current_user_or_access_token_error = await get_current_user_from_token(access_token= req.headers['access_token'], db=db)
            
            if data.password != data.password_confirm:
              return {"result": "password and password confirmation boxes do not match."}

            else: 
              user = {
                "email": data.email,
                "password": data.password,
                "username": data.username,
                "security_answer": data.security_answer,
                "security_name": data.security_name,
              }

              try:
                returned_user_or_error, EMAIL_CHANGED = await update_user(
                  user=user, current_email=current_user_or_access_token_error.email, username=current_user_or_access_token_error.username, user_id=current_user_or_access_token_error.id, db=db)
                return {
                          "username": returned_user_or_error, 
                          "EMAIL_CHANGED": EMAIL_CHANGED,
                          "result": "Profile updating completed. Please, click on a link."
                        }
              except AttributeError as e:
                print(e)
                return {"result": "email or username is present errror on server"}    


@router.get("/update_email/{access_token}", response_model=UserResponse)
async def patch_user(
                      req: Request,
                      db: Session = Depends(get_db)
                    ):

            current_user_or_access_token_error, user_id = await get_current_user_from_token(access_token= req.headers['access_token'], db=db)

            try:
              returned_user_or_error = await update_email(
                                                          current_email = current_user_or_access_token_error.email,  
                                                          user_id = user_id, 
                                                          db = db
                                                        )
              return {
                        "username": returned_user_or_error, 
                        "result": "Profile updating completed. Please, click on a link."
                      }
            except AttributeError as e:
              print(e)
              return {"result": "email or username is present errror on server"}   


@router.get("/security_questions")
async def security_questions():
    return {
              "BORN_CITY": SecurityEnum.BORN_CITY, 
              "FAVORITE_PET": SecurityEnum.FAVORITE_PET, 
              "MOTHER_MAIDEN_NAME": SecurityEnum.MOTHER_MAIDEN_NAME,
              "GRADUATED_HIGH_SCHOOL_NAME": SecurityEnum.GRADUATED_HIGH_SCHOOL_NAME,
              "FIRST_CAR": SecurityEnum.FIRST_CAR,
              "FAVORITE_FOOD": SecurityEnum.FAVORITE_FOOD,
            }


@router.get("/security_question")
async def security_question(req: Request, db: Session = Depends(get_db)):
  returned_user =  await get_current_user_from_token(access_token=req.headers['access_token'], db=db)
  return {"email": returned_user.email, "security_name": returned_user.security_name, "username": returned_user.username}


@router.get("/logout")
async def logout(req: Request, db: Session = Depends(get_db)):
  await logout_user(access_token=req.headers['access_token'], db=db)

