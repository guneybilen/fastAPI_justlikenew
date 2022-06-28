from ..base_db import Base
from sqlalchemy import Boolean, Column, Date, ForeignKey, DateTime
from sqlalchemy import Integer, String, Float, Text
from sqlalchemy.orm import relationship 
from datetime import datetime


class Item(Base):
  owner = relationship("User", back_populates="items")
  id = Column(Integer, primary_key=True, index=True)
  brand = Column(String, nullable=False) 
  model = Column(String, nullable=False)
  location = Column(String, nullable=False)
  description = Column(String, nullable=False)
  is_active = Column(Boolean(), default=True)
  date_posted = Column(Date)
  seller_id = Column(Integer, ForeignKey("user.id"))
  price = Column(Float(7,2), nullable=True)
  entry = Column(Text(1000), nullable=True)
  created_date = Column(DateTime, default=datetime.utcnow)
  updated_date = Column(DateTime, default=datetime.now, onupdate=datetime.now)    
  item_image1 = Column(String, nullable=True)
  item_image2 = Column(String, nullable=True)
  item_image3 = Column(String, nullable=True)

