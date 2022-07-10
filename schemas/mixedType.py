from pydantic import BaseModel
from typing import Optional
from typing import List, Union
from schemas.scopes import Scope


class MixedType(BaseModel):
  access_token: str
  token_type: str
  loggedin_username: str
  scopes = list[Scope]

  class Config:
    orm_mode = True
    use_enum_values = True
