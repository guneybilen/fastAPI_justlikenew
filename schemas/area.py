from datetime import datetime
from fastapi_utils.enums import StrEnum
from pydantic import BaseModel
from datetime import datetime

class Scope(StrEnum):
  READ = "READ" 
  WRITE =  "WRITE"
  BOTH =  "BOTH"

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
  user = str
  scopes = [Scope]                                                        
  permission_to_model = [PermissionToModel]
  permission_to_user = [PermissionToUser]

  @staticmethod
  def get_scope():
    return Scope