from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional
from datetime import datetime
from schemas.item import ShowItem 
from typing import Union
from schemas.area import Scope

class SecurityEnum(str, Enum):
   BORN_CITY: str = "BORN_CITY" 
   FAVORITE_PET: str = "FAVORITE_PET"
   MOTHER_MAIDEN_NAME: str = "MOTHER_MAIDEN_NAME"
   GRADUATED_HIGH_SCHOOL_NAME: str = "GRADUATED_HIGH_SCHOOL_NAME"  
   FIRST_CAR: str = "FIRST_CAR" 
   FAVORITE_FOOD: str = "FAVORITE_FOOD"


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
  first_name: Optional[str]
  last_name: Optional[str]
  security_name: SecurityEnum
  security_answer: str
  
  class Config:
    orm_mode = True
    use_enum_values = True



class ShowUser(BaseModel):
  username: Union[str, None] = None
  email: Union[EmailStr, None] = None
  is_active: bool
  result: Union[str, None] = None

  class Config:
    orm_mode = True


class UserResponse(BaseModel):
    email: EmailStr
    result: str

    class Config:
      orm_mode = True
      use_enum_values = True


class ShowAllImportantDataAboutUser(BaseModel):
     id: int
     email: EmailStr
     username: str
     first_name: str
     last_name: str
     created_date: datetime
     is_active: bool
     items: Optional[list[ShowItem]]
     scopes: list[Scope]
     
     class Config:
       orm_mode = True
       use_enum_values = True


# class ShowSecurityEnum(BaseModel):
#     security_enum: SecurityEnum

#     class Config:
#       orm_mode = True
#       use_enum_values = True