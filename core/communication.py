from core.email import communicate
from core.security import create_access_token
from schemas.user import UserPreCreate
from db.models.user import User
from datetime import timedelta
from dotenv import load_dotenv
from pathlib import Path
import os as _os
import inspect


env_path = Path(".") / ".env"
load_dotenv(dotenv_path = env_path)


async def email_confirmation_communication(user: UserPreCreate, db, proposed_email: UserPreCreate = None):

  if(inspect.stack()[1][3]=="pre_create_user"):
    searching_for_email_in_database = db.query(User).filter(User.email==user.email).first()

    if(searching_for_email_in_database is not None):
      return False

    FILLER = "signing up"
    REQUIRED_URL = _os.getenv("SIGNUP_URL")

    # creating list       
    list = [] 
    print(user.email)

    # appending instances to list 
    list.append(['email', user.email])

    # expires_delta is measured in minutes
    access_token = create_access_token(
                                        data={"sub": user.email, "user_id": user.id}, expires_delta = timedelta(minutes=10)
                                      )  

  if(inspect.stack()[1][3]=="patch_user"):
    searching_for_email_in_database = db.query(User).filter(User.email==proposed_email).first()

    if(searching_for_email_in_database is not None):
      return False

    FILLER = "update email procedure"
    REQUIRED_URL = _os.getenv("UPDATE_EMAIL_URL")

    # creating list       
    list = [] 
    print(proposed_email)

    # appending instances to list 
    list.append(['email', proposed_email])

    # expires_delta is measured in minutes
    access_token = create_access_token(
                              data={"sub": proposed_email, "user_id": user.id}, expires_delta = timedelta(minutes=10)
                            )  

  URL_FOR = REQUIRED_URL + f"{access_token}"
  
  html = f"<br /><br /><br /><p>thanks for {FILLER} at our website.</p><p>please follow the link below to complete your process</p><a href={URL_FOR}>{URL_FOR}</a><p>sincerely,<br />admin</p>"
  subject_line = f"for completing {FILLER}..."

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
