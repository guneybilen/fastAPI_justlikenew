from pydantic import BaseModel, EmailStr
from enum import Enum

class SecurityEnum(str, Enum):
   BORN_CITY = "BORN_CITY" 
   FAVORITE_PET = "FAVORITE_PET"
   MOTHER_MAIDEN_NAME = "MOTHER_MAIDEN_NAME"
   GRADUATED_HIGH_SCHOOL_NAME = "GRADUATED_HIGH_SCHOOL_NAME"  
   FIRST_CAR = "FIRST_CAR" 
   FAVORITE_FOOD = "FAVORITE_FOOD"

class UserCreate(BaseModel):
  username: str
  email: EmailStr
  password: str
  first_name: str
  last_name: str
  s_name: SecurityEnum
  s_answer: str

  class Config:
    orm_mode = True
    use_enum_values = True

class ShowUser(BaseModel):
  username: str
  email: EmailStr
  is_active: bool

  class Config:
    orm_mode = True