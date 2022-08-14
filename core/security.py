from datetime import datetime, timedelta
from typing import Optional
from core.config import settings
from jose import jwt
from jose.exceptions import ExpiredSignatureError, JWTError
from db.session import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from core.config import Settings as settings
from db.session import get_db
from db.models.user import User
from db.models.limit import Limit
from db.models.area import Area
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, Security, status
from schemas.user import UserCreate 
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


async def get_current_user_for_token_expiration(access_token_parsed:str, db: Session):
    credentials_exception = HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Could not validate credentials",
          headers={"WWW-Authenticate": "access token has expired"},
      )
    try:
        print("access_token_parsed ", access_token_parsed)
        payload = jwt.decode(access_token_parsed, settings.SECRET_KEY, algorithms=(settings.ALGORITHM))
        user_email: str = payload.get("sub")
        user_id: str = payload.get("id")
        print("username/email extracted is", user_email)
        print("user id extracted is", user_id)
        user = db.query(User).filter(User.email == user_email).one_or_none()
        token_in_limit_table = db.query(Limit).filter(Limit.user_id == user.id).one_or_none()
        if token_in_limit_table.access_token is None:
          raise SQLAlchemyError
        return token_in_limit_table.access_token, user_id

    except SQLAlchemyError as e:
        print("SQLAlchemyError ", e)
        return status.HTTP_205_RESET_CONTENT
    except ExpiredSignatureError:
        raise credentials_exception
    except JWTError as e:
        print("JWTError ", e)
        return status.HTTP_205_RESET_CONTENT


async def get_current_user_from_token_during_signup(access_token: str, db: Session):
    # print(access_token)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "email does not match the signed up request attempt"},
    )
    try:
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=(settings.ALGORITHM))
        user_email: str = payload.get("sub")
        print("username/email extracted is", user_email)
        print(user_email)
        if user_email is None:
          db.query(Limit).filter(Limit.access_token == access_token).delete()
          raise credentials_exception
        return user_email
    except ExpiredSignatureError:
        return "expired_access_token_during_signup"
    except JWTError:
        return None

    
    
async def check_token_expiration(access_token: str, db: Session):
    access_token_parsed = access_token.split(" ")[1]
    # print(access_token)
    result = await get_current_user_for_token_expiration(access_token_parsed, db)
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
    try:
        print("access_token", access_token)
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=(settings.ALGORITHM))
        email: str = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        print("usnername/email extracted is", user.email)
        print("user.id extracted is", user.id)
        return user
        # if user is None:
        #         raise credentials_exception
        #   token_scopes = payload.get("scopes", [])
        #   token_data = Area(scopes=token_scopes, username=user.username)
    except (JWTError, ValidationError, ExpiredSignatureError) as e:
        return f"access_token_error {e}"
        #     raise credentials_exception
        # user = db.query(User).filter_by(username=token_data.username).first()
    # if user is None:
    #     raise credentials_exception
    # for scope in scopes.scopes:
    #     if scope not in token_data.scopes:
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="Not enough permissions",
    #             headers={"WWW-Authenticate": authenticate_value},
    #        )
    # else:
    #   return user


async def get_current_active_user(
    current_user: User = Security(get_current_user_from_token, scopes=["me"])
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def logout_user(access_token: str, db: Session):
    try:
        db.query(Limit).filter(Limit.access_token==access_token).delete()
        return True
    except Exception as e:
        print("Error occurred during logout ", e)
        return False


async def create_area_table_entry(user_id: int, db: Session):
  try: 
    area_entry = Area(user_id = user_id, scopes=["READ_WRITE"], 
                     permission_to_model = ["IMAGES", "USERS", "ITEMS"],
                     permission_to_user = ["OWNER"])

    db.add(area_entry)
    return None
  except Exception as e:
    return None


def create_limit_table_entry(access_token_entry: str, token_type_entry: str, user_id: int, db: Session):
  # print("user_id", user_id)
  # print("access_token_entry", access_token_entry)
  limit = db.query(Limit).filter(Limit.user_id == user_id).one_or_none()
  if limit is not None:
    return None

  limit_entry = Limit(access_token = access_token_entry, token_type = token_type_entry, user_id = user_id)

  db.add(limit_entry)
  db.commit()
  db.refresh(limit_entry)
  return limit_entry.id


def create_acess_token_and_create_limit_table_entry(user: str, db: Session, id: int):
  access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
  access_token = create_access_token(
    data={"sub": user}, expires_delta=access_token_expires
  )

  create_limit_table_entry(access_token_entry = access_token, token_type_entry = "bearer", user_id = id, db = db)
  
  return access_token

def check_owner(access_token_for_id_check: str, db: Session):
    try:
      payload = jwt.decode(access_token_for_id_check, settings.SECRET_KEY, algorithms=(settings.ALGORITHM))
      user_email: str = payload.get("sub")
      # print("username/email extracted is", user_email)
      user = db.query(User).filter(User.email == user_email).first()
      # print("usnername id extracted is", user.id)
      return user.id

    except Exception as e:
      print("Exception ", e)
      return str(e)