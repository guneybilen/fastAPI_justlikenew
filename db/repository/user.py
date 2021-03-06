from core.hashing import Hasher  
from ..models.user import User    
from schemas.user import UserCreate 
from sqlalchemy.orm import Session  
from fastapi import HTTPException, status
from schemas.user import SecurityEnum
from sqlalchemy.exc import IntegrityError
from core.security import create_area_table_entry


async def create_new_user(user: UserCreate, db: Session):  
  
  if user['security_name'] == SecurityEnum.BORN_CITY:
      security_name = SecurityEnum.BORN_CITY
  if user['security_name'] == SecurityEnum.MOTHER_MAIDEN_NAME:
    security_name =  SecurityEnum.MOTHER_MAIDEN_NAME
  if user['security_name'] == SecurityEnum.FAVORITE_FOOD:
    security_name = SecurityEnum.FAVORITE_FOOD
  if user['security_name'] == SecurityEnum.GRADUATED_HIGH_SCHOOL_NAME:
    security_name = SecurityEnum.GRADUATED_HIGH_SCHOOL_NAME
  if user['security_name'] == SecurityEnum.FAVORITE_PET:
    security_name = SecurityEnum.FAVORITE_PET
  if user['security_name'] == SecurityEnum.FIRST_CAR:
    security_name =  SecurityEnum.FIRST_CAR

  user_being_saved = User(
        username=user['username'],
        email=user['email'],
        hashed_password=Hasher.get_hash(user['password']),
        is_active=True,
        is_superuser=False,
        first_name=user['first_name'],
        last_name=user['last_name'],
        security_name= security_name,
        security_answer=Hasher.get_hash(user['security_answer'])
  )
  try: 
    db.add(user_being_saved)
    db.flush()
    await create_area_table_entry(user_id = user_being_saved.id, db = db)
    db.commit() 
    db.refresh(user_being_saved)
  except IntegrityError as error:
    return IntegrityError(params=[], 
                          statement=[],
                          orig="either the email or username already exists and is being used. please, correct the problem(s).")
  return user_being_saved
  # raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="user sign up and required user email confirmation does not match")


def get_user_by_email(email: str, db: Session):
  user= db.query(User).filter(User.email == email).first() 
  return user
