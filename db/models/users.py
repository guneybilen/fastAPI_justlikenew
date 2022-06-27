from ..base_db import Base 
from sqlalchemy import Boolean, Column 
from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship

class User(Base):
  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, uniques=True, nullable=False)
  email = Column(String, nullable=False, unique=True, index=True) 
  hashed_password = Column(String, nullable=False) 
  is_active=Column(Boolean(), default=True)
  is_superuser = Column(Boolean(), default=False)

  jobs = relationship('Job', back_populates="owner")
  

