from datetime import datetime
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
  limit_id = int
  scopes = [Scope]                                                        
  permission_to_model = [PermissionToModel]
  permission_to_user = [PermissionToUser]

  @staticmethod
  def get_scope():
    return Scope
  class Config():
    orm_mode = True
    use_enum_values = True
    arbitrary_types_allowed = True