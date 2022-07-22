from pydantic import BaseModel, EmailStr, constr
from enum import Enum
from typing import Dict, Optional
from datetime import datetime
from schemas.item import ShowItem 
from typing import Union, Dict, Any
from schemas.area import Area
from schemas.limit import Limit

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
  username: constr(strip_whitespace=True, min_length=3, max_length=50)
  password: constr(strip_whitespace=True, min_length=7, max_length=50)
  password_confirm: constr(strip_whitespace=True, min_length=7, max_length=50)
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
    email: Optional[EmailStr]
    username: Optional[str]
    result: Optional[str]
    detail : Optional[str]

    class Config:
      orm_mode = True
      use_enum_values = True


class ShowAllImportantDataAboutUser(BaseModel):
     id: Optional[int]
     email: Optional[EmailStr]
     username: Optional[str]
     first_name: Optional[str]
     last_name: Optional[str]
     created_date: Optional[datetime]
     is_active: Optional[bool]
     items: Optional[ShowItem]
     areas: Optional[Area]
     limit: Optional[Limit]
     
     class Config:
       orm_mode = True
       use_enum_values = True


# class ShowSecurityEnum(BaseModel):
#     security_enum: SecurityEnum

#     class Config:
#       orm_mode = True
#       use_enum_values = True