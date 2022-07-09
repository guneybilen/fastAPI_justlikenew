from pydantic import BaseModel
from schemas.tokens import Token
from schemas.users import ShowAllImportantDataAboutUser
from typing import Optional


class MixedType(BaseModel):
  access_token: str
  token_type: str
  loggedin_username: str

  class Config:
    orm_mode = True
    use_enum_values = True
