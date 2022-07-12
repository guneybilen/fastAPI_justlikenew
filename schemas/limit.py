
from pydantic import BaseModel
from datetime import datetime

class Area(BaseModel):
    created_date: datetime
    updated_date: datetime
    access_token: str
    