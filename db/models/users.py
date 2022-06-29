from typing import Dict
from ..base_db import Base 
from sqlalchemy import Boolean, Column, DateTime
from sqlalchemy import Integer, String
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import relationship 
from datetime import datetime
from fastapi_utils.enums import StrEnum
from enum import auto


class SecurityQuestion(StrEnum):
   BORN_CITY = auto() 
   FAVORITE_PET =  auto()
   MOTHER_MAIDEN_NAME =  auto()
   GRADUATED_HIGH_SCHOOL_NAME =  auto()  
   FIRST_CAR = auto() 
   FAVORITE_FOOD = auto()


class User(Base):
  items = relationship('Item', back_populates="user")
  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, unique=True, nullable=False)
  email = Column(String, nullable=False, unique=True, index=True) 
  hashed_password = Column(String, nullable=False) 
  is_active = Column(Boolean(), default=True)
  is_superuser = Column(Boolean(), default=False)
  first_name = Column(String(100), nullable=False)
  last_name = Column(String(100), nullable=False)
  phone_number = Column(String(50), nullable=True)
  created_date = Column(DateTime, default=datetime.utcnow)
  updated_date = Column(DateTime, default=datetime.now, onupdate=datetime.now)   
  s_name = Column(String, nullable= False)                                                         
  # s_name = Column("security_question", ENUM(SecurityQuestion, values_callable=lambda x: [e.value for e in x]))
  #s_name = Column(ENUM(SecurityQuestion, values_callable=lambda x: [v for k,v in {"CITY": "In what city were you born?","PET": "What is the name of your favorite pet?" , "MAIDEN": "What is your mother's maiden name?","SCHOOL": "What is the name of your first school?", "CAR": "What was the make of your first car?", "FOOD": "What was your favorite food as a child?"}.items()]))
  s_answer = Column(String(255), nullable=False)
  refresh_token = Column(String(255), nullable=True, default=None)
