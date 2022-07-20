from datetime import datetime, timedelta
from typing import Optional
from core.config import settings
from jose import jwt
from jose.exceptions import ExpiredSignatureError, JWTError
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


async def get_current_user_from_token_during_signup(access_token: str, db: Session):
    # print(access_token)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "email does not match the signed up request attempt"},
    )
    try:
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=(settings.ALGORITHM))
    except ExpiredSignatureError:
        return None
    except JWTError:
        return None
    user_email: str = payload.get("sub")
    print("username/email extracted is", user_email)
    user = db.query(User).filter(User.email == user_email).first()
    print(user.username)
    if user.username is None:
        raise credentials_exception
    return user.username
    
    
async def check_token_expiration(access_token: str, db: Session):
    acces_token_parsed = access_token.split(" ")[1]
    result = await get_current_user_from_token_during_signup(acces_token_parsed, db)
    print('result ', result)
    return result

# TODO: take care of scoping
# async def get_current_user_from_token(
#     scopes: SecurityScopes, access_token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
# ):
async def get_current_user_from_token(access_token: str, db: Session = Depends(get_db)
):
    # if scopes.scopes:
    #     authenticate_value = f'Bearer scope="{scopes.scope_str}"'
    # else:
    #     authenticate_value = f"Bearer"

    # credentials_exception = HTTPException(
    #     status_code=status.HTTP_401_UNAUTHORIZED,
    #     detail="Could not validate credentials",
    #     headers={"WWW-Authenticate": authenticate_value},
    # )
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Not authenticated"},
    )
    # try:
    print("access_token", access_token)
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=(settings.ALGORITHM))
    email: str = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    print("usnername/email extracted is", user.email)
#   if user is None:
    #         raise credentials_exception
    #   token_scopes = payload.get("scopes", [])
    #   token_data = Area(scopes=token_scopes, username=user.username)
    # except (JWTError, ValidationError):
    #     raise credentials_exception
    # user = db.query(User).filter_by(username=token_data.username).first()
    if user is None:
        raise credentials_exception
    # for scope in scopes.scopes:
    #     if scope not in token_data.scopes:
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="Not enough permissions",
    #             headers={"WWW-Authenticate": authenticate_value},
    #        )
    else:
      return user


async def get_current_active_user(
    current_user: User = Security(get_current_user_from_token, scopes=["me"])
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


