from sqlalchemy.sql.schema import ForeignKey
from ..base_db import Base
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from datetime import datetime
from db.models import *

class Limit(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    created_date=Column(DateTime(),default=datetime.utcnow)
    updated_date=Column(DateTime(),default=datetime.utcnow, onupdate=datetime.utcnow)
    access_token = Column(String, nullable=False)
    token_type = Column(String, nullable=False, default="bearer")
    area = relationship("Area", backref="limits")




