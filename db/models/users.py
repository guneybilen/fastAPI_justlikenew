from ..base_db import Base 
from sqlalchemy import Boolean, Column, DateTime
from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship
import sqlalchemy.types as types
from datetime import datetime


class SecurityType(types.TypeDecorator):
    impl = types.Unicode

    cache_ok = True
   
    def __init__(self):
      self.security_question = {
        "CITY": "In what city were you born?",
        "PET": "What is the name of your favorite pet?",
        "MAIDEN": "What is your mother's maiden name?",
        "SCHOOL": "What is the name of your first school?",
        "CAR": "What was the make of your first car?",
        "FOOD": "What was your favorite food as a child?",
      }
      self.internal_only = True

    def process_bind_param(self, value, dialect):
        return "VARCHAR(255)"

    def process_result_value(self, value, dialect):
        return self.security_question[value]


class User(Base):
  items = relationship('Item', back_populates="seller")
  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, unique=True, nullable=False)
  email = Column(String, nullable=False, unique=True, index=True) 
  hashed_password = Column(String, nullable=False) 
  is_active=Column(Boolean(), default=True)
  is_superuser = Column(Boolean(), default=False)
  first_name = Column(String(100))
  last_name = Column(String(100))
  phone_number = Column(String(50))
  created_date = Column(DateTime, default=datetime.utcnow)
  updated_date = Column(DateTime, default=datetime.now, onupdate=datetime.now)                                                            
  s_name = Column(String(100), SecurityType(), nullable=False)
  s_answer = Column(String(255))
  refresh_token = Column(String(255), nullable=True, default=None)
