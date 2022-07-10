from sqlalchemy.sql.schema import ForeignKey
from ..base_db import Base
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime


class Entry(Base):
  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, ForeignKey("users.username"))
  scopes = Column(ARRAY(String), nullable=True)
  date_created=Column(DateTime(),default=datetime.utcnow)
  user = relationship("User", back_populates="entry")
  scope_id = Column(Integer, ForeignKey("scope.id"))
  scopes = relationship("Scope", back_populates="entry")
  access_token: Column(String, nullable=True)
  token_type: Column(String, nullable=False, default="bearer")
