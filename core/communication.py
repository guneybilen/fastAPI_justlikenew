from core.email import communicate
from core.security import create_access_token
from schemas.users import UserPreCreate
from datetime import timedelta
from dotenv import load_dotenv
from pathlib import Path
import os as _os


env_path = Path(".") / ".env"
load_dotenv(dotenv_path = env_path)


async def pre_create_new_user_comminication(user: UserPreCreate):
  
  # expires_delta is measured in minutes
  access_token = create_access_token(
                            data={"sub": user.email}, expires_delta = timedelta(minutes=10)
                           )  
  html = f"<p>thanks for signing up our Website.</p><p>please follow the link below to complete your sign up process</p><a href='{_os.getenv('SIGNUP_URL')/{access_token}}'>{_os.getenv('SIGNUP_URL')/{access_token}}</a><p>Sincerely,<br />admin</p>"
  subject_line = "For completing signing up..."

  # creating list       
  list = [] 
  
  # appending instances to list 
  list.append('email', user.email)

  await communicate(list, subject_line, html)

  return user


async def communicate_for_forgotten_password(email):

  # expires_delta is measured in minutes
  access_token = create_access_token(data={"sub": email}, expires_delta = timedelta(minutes=10))

  html = f"<p>Please proceed to the following link in order to reset your password. If you do not want to reset your password, please disregard this email. <p><a href={_os.getenv('FORGOT_PASSWORD_URL')/{access_token}}>{_os.getenv('FORGOT_PASSWORD_URL')/{access_token}}</p>"
  
  subject_line = "Follow the link for resetting your password"

  # creating list       
  list = [] 

  list.append('email', email)

  json_result = await communicate(list, subject_line, html)

  if json_result['status'] == 200:
    return True
  else: 
    return False
