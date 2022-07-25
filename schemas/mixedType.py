from pydantic import BaseModel
from typing import Optional
from typing import List
from schemas.area import Area


class MixedType(BaseModel):
  access_token: str
  token_type: str
  loggedin_username: str
  scope: Optional[list[Area]]

  class Config:
    orm_mode = True
    use_enum_values = True
