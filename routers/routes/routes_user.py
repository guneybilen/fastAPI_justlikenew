from schemas.users import ShowUser, UserCreate, UserPreCreate, UserPreCreateShow
from fastapi import APIRouter, Depends
from db.session import get_db
from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from routers.utils import OAuth2PasswordBearerWithCookie

from core.config import settings

from core.hashing import Hasher
from core.security import create_access_token
from db.repository.login import get_user
from db.repository.users import pre_create_new_user, create_new_user
from db.session import get_db
from fastapi.responses import RedirectResponse


from jose import jwt, JWTError
from schemas.tokens import Token
from sqlalchemy.orm import Session

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
  #user = get_user(username=username, db=db)
  #if user is None:
  #  raise credentials_exception
  return username


# @router.post("/", response_model=ShowUser)
# def create_user(user: UserCreate, db: Session = Depends(get_db)):
#   user = create_new_user(user=user, db=db)
#   return user


# @router.get("/new_user/{current_user}", response_model=UserPreCreateShow)
# def create_user(current_user: str):
#   # user = create_new_user(user=user, current_user=current_user, db=db)
#   return {"email": current_user}


@router.post("/precreate", response_model=ShowUser)
async def pre_create_user(user: UserPreCreate):
  user = await pre_create_new_user(user=user)
  # return {"user_username": user.username, "user_email": user.email, "is_active": user.is_active, "result": "please check your email inbox for completing your signup procedure..."}
  return {"user": user, "result": "please check your email inbox for completing your signup procedure..."}


@router.get("/signup/{access_token}", response_model = UserPreCreateShow)
def check_user(access_token: str, request: Request, db: Session = Depends(get_db)):
  current_user = get_current_user_from_token(access_token, db)
  # event = {'current_user': current_user}
  # redirect_url = request.url_for("create_user", **{'current_user': event["current_user"]})
  # return RedirectResponse(redirect_url, status_code=status.HTTP_302_FOUND)
  return {"email": current_user}
