from ..base_db import Base
from sqlalchemy import Column
from sqlalchemy import Integer, String
from sqlalchemy.dialects.postgresql import ARRAY

class TokenData(Base):
  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, nullable=True)
  scopes = Column(ARRAY(String), nullable=True)
