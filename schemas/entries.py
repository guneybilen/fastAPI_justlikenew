from pydantic import BaseModel
from typing import List, Union
from datetime import datetime
 
class Entry(BaseModel):
  username: Union[str, None] = None
  scopes: List[str] = []
  date_created: datetime
  date_updated: datetime
  access_token: str
  token_type: str

  class Config:
    orm_mode = True
    use_enum_values = True