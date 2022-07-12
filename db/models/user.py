from ..base_db import Base 
from sqlalchemy import Boolean, Column, DateTime
from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship 
from datetime import datetime
from fastapi_utils.enums import StrEnum
from enum import auto
from db.models import limit

class SecurityQuestion(StrEnum):
   BORN_CITY = auto() 
   FAVORITE_PET =  auto()
   MOTHER_MAIDEN_NAME =  auto()
   GRADUATED_HIGH_SCHOOL_NAME =  auto()  
   FIRST_CAR = auto() 
   FAVORITE_FOOD = auto()


class User(Base):
      id = Column(Integer, primary_key=True, index=True)
      username = Column(String, unique=True, nullable=False)
      email = Column(String, nullable=False, unique=True, index=True) 
      hashed_password = Column(String, nullable=False) 
      is_active = Column(Boolean(), default=False)
      is_superuser = Column(Boolean(), default=False)
      first_name = Column(String(100), nullable=True)
      last_name = Column(String(100), nullable=True)
      phone_number = Column(String(50), nullable=True)
      created_date = Column(DateTime, default=datetime.utcnow)
      updated_date = Column(DateTime, default=datetime.now, onupdate=datetime.now)   
      security_name = Column(String, nullable= False)                                                         
      security_answer = Column(String(255), nullable=False)
      item = relationship('Item', backref="users")
      limit = relationship('Limit', backref="users")