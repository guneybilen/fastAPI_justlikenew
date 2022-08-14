from core.hashing import Hasher  
from ..models.user import User    
from schemas.user import UserCreate, UserUpdate
from sqlalchemy.orm import Session  
from schemas.user import SecurityEnum
from sqlalchemy.exc import IntegrityError
from core.security import create_area_table_entry
from sqlalchemy import update
import os as _os


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

async def update_user(user: UserUpdate, username: str, user_id: int, db: Session):  
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

  try:
    stmt = (update(User).where(User.id == user_id).values(
                                                          username=user["username"],
                                                          email=user["email"],
                                                          hashed_password=Hasher.get_hash(user['password']),
                                                          is_active=True,
                                                          is_superuser=False,
                                                          security_name= security_name,
                                                          security_answer=Hasher.get_hash(user['security_answer'])
                                                        ))
    db.execute(stmt)
    _os.chdir("/home/bilen/Desktop/projects/fastapi/justlikenew/static/images")
    for file in _os.listdir("."):
      result = file.split(username)
      if len(result) > 1:
          print(result)
          _os.rename(file, f"{user['username']}{result[1]}")
    db.commit()
    return user["username"]
  except Exception as e:
    # if there is an exception occurred, rewinding back renaming of the folders...
    _os.chdir(r"../../static/images")
    for file in _os.listdir("."):
      result = file.split(user['username'])
      if len(result) > 1:
          print(result)
          _os.rename(file, f"{username}{result[1]}")
    print(e)


def get_user_by_email(email: str, db: Session):
  user= db.query(User).filter(User.email == email).first() 
  return user
