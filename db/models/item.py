from ..base_db import Base
from sqlalchemy import Boolean, Column, Date, ForeignKey, DateTime
from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import relationship 
from datetime import datetime
from db.models import *

class Item(Base):
  image = relationship("Image", backref="items")
  # images = relationship('Image', back_ref="items")
  id = Column(Integer, primary_key=True, index=True)
  brand = Column(String, nullable=True) 
  model = Column(String, nullable=True)
  location = Column(String, nullable=True)
  description = Column(Text, nullable=True)
  is_active = Column(Boolean(), default=True)
  seller_id = Column(Integer, ForeignKey("user.id"))
  price = Column(String, nullable=True)
  created_date = Column(DateTime, default=datetime.utcnow)
  updated_date = Column(DateTime, default=datetime.now, onupdate=datetime.now)    


