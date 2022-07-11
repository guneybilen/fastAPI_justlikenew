from ..base_db import Base 
from sqlalchemy.dialects.postgresql import ARRAY 
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy import Column, DateTime
from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship 
from datetime import datetime
from fastapi_utils.enums import StrEnum
from enum import auto
from db.models import *

class Permission(StrEnum):
  READ = auto() 
  WRITE =  auto()
  BOTH =  auto()

class PermissionToModel(StrEnum):
  IMAGES = auto() 
  USERS =  auto()
  ITEMS =  auto()

class PermissionToUser(StrEnum):
  OWNER = auto() 
  LOGGED_IN_USER =  auto()
  ALL_USERS =  auto()


class Area(Base):
    id = Column(Integer, primary_key=True, index=True)
    limit_id = Column(Integer, ForeignKey("limit.id"))

    created_date=Column(DateTime(),default=datetime.utcnow)
    updated_date = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    scopes = Column(ARRAY(String), default=["READ", "WRITE", "BOTH"], nullable= False)                                                         
    permission_to_model = Column(ARRAY(String), default=["IMAGES", "USERS", "ITEMS"], nullable=False)
    permission_to_user = Column(String(50), default="OWNER", nullable=False)