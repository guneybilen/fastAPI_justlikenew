from datetime import datetime, timedelta
from typing import Optional
from core.config import settings
from jose import jwt
from fastapi import Depends, HTTPException, status
from db.session import get_db
from sqlalchemy.orm import Session

from core.config import Settings as settings
from db.session import get_db
from db.models.users import User

from jose import jwt, JWTError
from sqlalchemy.orm import Session


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
  to_encode = data.copy()
  if expires_delta:
    expire = datetime.utcnow() + expires_delta
  else:
    expire = datetime.utcnow() + timedelta(
      minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
  
  to_encode.update({"exp": expire})
  encoded_jwt = jwt.encode(
    to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
  )
  return encoded_jwt


def get_current_user_from_token(
  access_token: str, db: Session = Depends(get_db)):

  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
    detail="Could not validate credentials"
  )

  try:
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=(settings.ALGORITHM))
    email: str = payload.get("sub")
    user = db.query(User).filter_by (email = email).first()
    print("usnername/email extracted is", user)
    if user.email is None:
      raise credentials_exception
  except JWTError:
    raise credentials_exception
  return user