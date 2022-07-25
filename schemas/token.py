from pydantic import BaseModel
from typing import List
from datetime import datetime
from typing import Optional
class Token(BaseModel):
  username: Optional[str]
  scopes: List[str] = []
  date_created: datetime
  date_updated: datetime
  access_token: str
  token_type: str

  class Config:
    orm_mode = True
    use_enum_values = True