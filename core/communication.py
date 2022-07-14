from core.email import communicate
from core.security import create_access_token
from schemas.user import UserPreCreate
from db.models.user import User
from datetime import timedelta
from dotenv import load_dotenv
from pathlib import Path
import os as _os


env_path = Path(".") / ".env"
load_dotenv(dotenv_path = env_path)


async def pre_create_new_user_communication(user: UserPreCreate, db):

  searching_for_email_in_database = db.query(User).filter(User.email==user.email).first()

  if(searching_for_email_in_database is not None):
    return False

  # expires_delta is measured in minutes
  access_token = create_access_token(
                            data={"sub": user.email}, expires_delta = timedelta(minutes=10)
                           )  
  URL_FOR_SIGNUP = _os.getenv('SIGNUP_URL') + f"{access_token}"
  
  html = f"<br /><br /><br /><p>thanks for signing up at our website.</p><p>please follow the link below to complete your sign up process</p><a href={URL_FOR_SIGNUP}>{URL_FOR_SIGNUP}</a><p>sincerely,<br />admin</p>"
  subject_line = "for completing signing up..."

  # creating list       
  list = [] 
  print(user.email)
    
  # appending instances to list 
  list.append(['email', user.email])

  await communicate(list, subject_line, html)

  return user


async def communicate_for_forgotten_password(email):

  # expires_delta is measured in minutes
  access_token = create_access_token(data={"sub": email}, expires_delta = timedelta(minutes=10))

  URL_FOR_FORGOT_PASSWORD = _os.getenv('FORGOT_PASSWORD_URL') + f"{access_token}"

  html = f"<br /><br /><br /><p>please proceed to the following link in order to reset your password. if you do not want to reset your password, please disregard this email. <p><a href={URL_FOR_FORGOT_PASSWORD}>{URL_FOR_FORGOT_PASSWORD}</a></p>"
  
  subject_line = "follow the link for resetting your password"

  # creating list       
  list = [] 

  list.append(['email', email])

  json_result = await communicate(list, subject_line, html)

  print(dir(json_result))

  if json_result.status_code == 200:
    return True
  else: 
    return False
