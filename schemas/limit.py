
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Limit(BaseModel):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    access_token: Optional[str]

    class Config:
      orm_mode = True
    