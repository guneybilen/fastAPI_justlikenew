from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional

class SecurityEnum(str, Enum):
   BORN_CITY = "BORN_CITY" 
   FAVORITE_PET = "FAVORITE_PET"
   MOTHER_MAIDEN_NAME = "MOTHER_MAIDEN_NAME"
   GRADUATED_HIGH_SCHOOL_NAME = "GRADUATED_HIGH_SCHOOL_NAME"  
   FIRST_CAR = "FIRST_CAR" 
   FAVORITE_FOOD = "FAVORITE_FOOD"


class UserPreCreate(BaseModel):
  email: EmailStr
  class Config:
    orm_mode = True
    use_enum_values = True

class UserPreCreateShow(BaseModel):
  email: Optional[EmailStr]
  class Config:
    orm_mode = True

class UserCreate(BaseModel):
  email: EmailStr
  username: str
  password: str
  first_name: str
  last_name: str
  s_name: SecurityEnum
  s_answer: str
  password: str
  class Config:
    orm_mode = True


class ShowUser(BaseModel):
  username: Optional[str]
  email: Optional[EmailStr]
  is_active: Optional[bool]
  result: Optional[str]

  class Config:
    orm_mode = True