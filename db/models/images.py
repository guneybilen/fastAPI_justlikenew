from ..base_db import Base
from sqlalchemy import Boolean, Column, Date, ForeignKey, DateTime
from sqlalchemy import Integer, String, Float, Text
from sqlalchemy.orm import relationship 
from datetime import datetime
  

class Image(Base):
  items = relationship('Item', back_populates="images")
  id = Column(Integer, primary_key=True, index=True)
  item_id = Column(Integer, ForeignKey("item.id"))
  item_image1 = Column(String, nullable=True)
  item_image2 = Column(String, nullable=True)
  item_image3 = Column(String, nullable=True)