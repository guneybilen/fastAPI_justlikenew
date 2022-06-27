from ..base_db import Base
from sqlalchemy import Boolean, Column, Date, ForeignKey 
from sqlalchemy import Integer, String 
from sqlalchemy.orm import relationship 

class Job(Base):
  id = Column(Integer, primary_key=True, index=True)
  title = Column(String, nullable=False) 
  company = Column(String, nullable=False)
  location = Column(String, nullable=False)
  description = Column(String, nullable=False)
  is_active = Column(Boolean(), default=True)
  owner_id = Column(Integer, ForeignKey("user.id"))
  date_posted = Column(Date)
  company_url = Column(String)

  owner = relationship("User", back_populates="jobs")