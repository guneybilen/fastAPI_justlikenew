from fastapi import APIRouter, Depends, HTTPException, status 
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

# from routers.utils import OAuth2PasswordBearerWithCookie

from core.config import settings

from core.hashing import Hasher
from core.security import create_access_token
from db.repository.login import get_user
from db.session import get_db
from typing import List

from schemas.mixedType import MixedType
from sqlalchemy.orm import Session

router = APIRouter()

def authenticate_user(username: str, password: str, db: Session = Depends(get_db)):
  user = get_user(username=username, db=db)
  print(user.username)
  if not user: 
    return False
  if not Hasher.verify_password(password, user.hashed_password):
    return False
  return user


@router.post("/token", response_model=MixedType)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(),
                           db: Session = Depends(get_db)):

                           print(form_data)

                           user = authenticate_user(form_data.username, form_data.password, db)

                           if not user:
                            raise HTTPException(
                              status_code=status.HTTP_401_UNAUTHORIZED, 
                              detail="Incorrect username or password"
                            )
                          
                           access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
                           access_token = create_access_token(
                            data={"sub": user.email}, expires_delta=access_token_expires
                           )

                           # For My Information: cross-domain cookie can not be set up and and also
                           # canot be read due to browser security architecture.
                           #  response.set_cookie(
                           #   key="access_token", value=f"Bearer {access_token}", httponly=True
                           #  )

                           return {"scopes": MixedType.scopes, "access_token": access_token, "token_type": "bearer", "loggedin_username": user.username}



# For My Information: cross-domain cookie can not be set up and and also
# canot be read due to browser security architecture. That is why we do not \
# use OAuth2PasswordBearerWithCookie and rather use OAuth2PasswordBearer class only.
# oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/login/token")


