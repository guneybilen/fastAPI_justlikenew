from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel
 
 
# shared properties
class ItemBase(BaseModel):
  brand: Optional[str] = None
  model: Optional[str] = None
  location: Optional[str] = None
  description: Optional[str] = None
  price: Optional[float] = None
  date_posted: Optional[date] = datetime.now().date()
  item_image1: Optional[str] = None
  item_image2: Optional[str] = None
  item_image3: Optional[str] = None

  class Config:
    orm_mode = True
# this will be used to validate data while creating a Item
class ItemCreate(ItemBase):
  pass

# this will be used to format the response to not to have id, owner_id etc
class ShowItem(ItemBase):
  brand: str
  model: str
  location: Optional[str]
  description: Optional[str]
  price: Optional[float]
  date_posted: Optional[date]
  item_image1: Optional[str]
  item_image2: Optional[str]
  item_image3: Optional[str]

  # to convert non-dict obj to json
  class Config():
    orm_mode = True