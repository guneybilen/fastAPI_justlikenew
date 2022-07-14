from datetime import datetime, timedelta
from typing import Optional
from core.config import settings
from jose import jwt
from jose.exceptions import ExpiredSignatureError
from db.session import get_db
from sqlalchemy.orm import Session
from core.config import Settings as settings
from db.session import get_db
from db.models.user import User
from db.models.area import Area
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import (
    SecurityScopes,
)

from routers.routes.oauth2_scheme import oauth2_scheme
from pydantic import ValidationError


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


async def get_current_user_from_token_during_signup(access_token: str, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "email does not match the signed up request attempt"},
    )
    try:
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=(settings.ALGORITHM))
    except ExpiredSignatureError:
        return None
    user_email: str = payload.get("sub")
    print("usnername/email extracted is", user_email)
    if user_email is None:
        raise credentials_exception
    return user_email

async def get_current_user_from_token(
    scopes: SecurityScopes, access_token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    if scopes.scopes:
        authenticate_value = f'Bearer scope="{scopes.scope_str}"'
    else:
        authenticate_value = f"Bearer"

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
      payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=(settings.ALGORITHM))
      email: str = payload.get("sub")
      user = db.query(User).filter_by (email = email).first()
      print("usnername/email extracted is", user)
      if user is None:
            raise credentials_exception
      token_scopes = payload.get("scopes", [])
      token_data = Area(scopes=token_scopes, username=user.username)
    except (JWTError, ValidationError):
        raise credentials_exception
    user = db.query(User).filter_by(username=token_data.username).first()
    if user is None:
        raise credentials_exception
    for scope in scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return user


async def get_current_active_user(
    current_user: User = Security(get_current_user_from_token, scopes=["me"])
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


