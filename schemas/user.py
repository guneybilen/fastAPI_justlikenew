from pydantic import BaseModel, EmailStr, constr
from enum import Enum
from typing import Dict, Optional
from datetime import datetime
from schemas.item import ShowItem 
from typing import Dict, Any
from schemas.area import Area
from schemas.limit import Limit
from schemas.image import ShowImage

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


class UserUpdate(BaseModel):
  email: Optional[EmailStr]
  username: Optional[constr(strip_whitespace=True, min_length=3, max_length=50)]
  password: Optional[constr(strip_whitespace=True, min_length=7, max_length=50)]
  password_confirm: Optional[constr(strip_whitespace=True, min_length=7, max_length=50)]
  security_name: Optional[SecurityEnum]
  security_answer: Optional[str]
  
  class Config:
    orm_mode = True
    use_enum_values = True



class ShowUser(BaseModel):
  username: Optional[str]
  email: Optional[EmailStr]
  is_active: bool
  result: Optional[str]

  class Config:
    orm_mode = True


class UserResponse(BaseModel):
    username: Optional[str]
    result: Optional[str]
    access_token : Optional[str]

    class Config:
      orm_mode = True
      use_enum_values = True


class ShowAllImportantDataAboutUser(BaseModel):
    id: Optional[str]
    email: Optional[EmailStr]
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    created_date: Optional[datetime]
    is_active: Optional[bool]
    item: Optional[list[ShowItem]]
    owner: Optional[str]
    #  area: Optional[list[Area]]
    #  limit: Optional[list[Limit]]
    class Config:
      orm_mode = True
      use_enum_values = True
      arbitrary_types_allowed = True


# class ShowSecurityEnum(BaseModel):
#     security_enum: SecurityEnum

#     class Config:
#       orm_mode = True
#       use_enum_values = True
