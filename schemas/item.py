from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from schemas.image import ShowImage
from datetime import datetime
 
# shared properties
class ItemBase(BaseModel):
  brand: str
  model: Optional[str]
  location: Optional[str]
  description: Optional[str]
  price: Optional[str]
  image: Optional[list[ShowImage]]

  class Config:
    orm_mode = True
    arbitrary_types_allowed = True
# this will be used to validate data while creating a Item
class ItemCreate(ItemBase):
  pass

# this will be used to format the response to not to have id, owner_id etc
class ShowItem(ItemBase):
  id: Optional[int]
  brand:  Optional[str]
  model:  Optional[str]
  location: Optional[str]
  description: Optional[str]
  price: Optional[str]
  created_date: Optional[datetime]
  updated_date: Optional[datetime]
  seller_id: Optional[int]
  image: Optional[list[ShowImage]]

  # to convert non-dict obj to json
  class Config():
    orm_mode = True
    arbitrary_types_allowed = True