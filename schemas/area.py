from datetime import datetime
from typing import Optional
from fastapi_utils.enums import StrEnum
from pydantic import BaseModel
from datetime import datetime

class Scope(StrEnum):
  READ = "READ" 
  WRITE =  "WRITE"
  READ_WRITE =  "READ_WRITE"

class PermissionToModel(StrEnum):
  IMAGES = "IMAGES"
  USERS =  "USERS"
  ITEMS =  "ITEMS"

class PermissionToUser(StrEnum):
  OWNER = "OWNER" 
  LOGGED_IN_USER =  "LOGGED_IN_USER"
  ALL_USERS =  "ALL_USERS"


class Area(BaseModel):
  created_date: datetime
  updated_date: datetime
  limit_id:  Optional[int]
  scopes: Optional[Scope]                                                        
  permission_to_model: Optional[PermissionToModel]
  permission_to_user: Optional[PermissionToUser]

  class Config():
    orm_mode = True
    use_enum_values = True
    arbitrary_types_allowed = True