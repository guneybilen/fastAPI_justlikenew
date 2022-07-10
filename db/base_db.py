from sqlalchemy.ext.declarative import as_declarative, declared_attr
from typing import Any

@as_declarative()
class Base:
  id: Any 
  __name__:str

  # to generate tablename from classname
  @declared_attr
  def __tablename__(klas) -> str:
    print(klas.__name__.lower())
    return klas.__name__.lower()
