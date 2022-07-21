from ..base_db import Base
from sqlalchemy import Boolean, Column, Date, ForeignKey, DateTime
from sqlalchemy import Integer, String, Float, Text
from sqlalchemy.orm import relationship 
from datetime import datetime
from db.models import *

class Image(Base):
  id = Column(Integer, primary_key=True, index=True)
  item_id = Column(Integer, ForeignKey("item.id"))
  created_date=Column(DateTime(),default=datetime.utcnow)
  updated_date=Column(DateTime(),default=datetime.utcnow, onupdate=datetime.utcnow)
  item_image1 = Column(String, nullable=True)
  item_image2 = Column(String, nullable=True)
  item_image3 = Column(String, nullable=True)