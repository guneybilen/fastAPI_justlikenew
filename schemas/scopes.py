from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy import Column, DateTime
from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship 
from datetime import datetime
from fastapi_utils.enums import StrEnum
from typing import List, Union
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


class Scope(BaseModel):
  username: str
  date_created: datetime
  updated_date: datetime
  user = str
  scope = [Scope]                                                        
  permission_to_model = [PermissionToModel]
  permission_to_user = [PermissionToUser]

  @staticmethod
  def get_scope():
    return Scope