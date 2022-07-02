from schemas.users import ShowUser, UserPreCreate, UserPreCreateShow
from fastapi import APIRouter, Depends
from db.session import get_db
from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, HTTPException, Request, status

from routers.utils import OAuth2PasswordBearerWithCookie

from core.communication import communicate_for_forgotten_password

from core.config import Settings as settings
from core.communication import pre_create_new_user_comminication
from db.repository.users import create_new_user
from db.session import get_db


from jose import jwt, JWTError
from schemas.tokens import Token
from sqlalchemy.orm import Session

from pydantic import EmailStr


router = APIRouter()

oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/login/token")


def get_current_user_from_token(
  token: str, db: Session = Depends(get_db)):

  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
    detail="Could not validate credentials"
  )

  try:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=(settings.ALGORITHM))
    username: str = payload.get("sub")
    print("usnername/email extracted is", username)
    if username is None:
      raise credentials_exception
  except JWTError:
    raise credentials_exception
  return username


@router.post("/precreate", response_model=ShowUser)
async def pre_create_user(user: UserPreCreate):
  user = await pre_create_new_user_comminication(user=user)
  return {"user": user, "result": "please check your email inbox for completing your signup procedure..."}


@router.get("/signup/{access_token}", response_model = UserPreCreateShow)
def check_user(access_token: str, request: Request, db: Session = Depends(get_db)):
  current_user = get_current_user_from_token(access_token, db)
  return {"email": current_user}

@router.get("/forgot_password")
def forgot_password(email: EmailStr, db: Session = Depends(get_db)):
  returned_boolean_result = communicate_for_forgotten_password(email, db)

  if returned_boolean_result:  
    return {"detail": "if there is an account associated with that email, we will email a link for resetting your password"}
  raise HTTPException(status_code= status.HTTP_500_INTERNAL_SERVER_ERROR, detail= "Network problem occured")  



