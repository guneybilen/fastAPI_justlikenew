from typing import Optional
from pydantic import BaseModel
from typing import List
from datetime import datetime
 
# shared properties
class ImageBase(BaseModel):
  item_image1: Optional[str]
  item_image2: Optional[str]
  item_image3: Optional[str]
  
  class Config:
    orm_mode = True


class ImageCreate(ImageBase):
  pass

# this will be used to format the response to not to have id, owner_id etc
class ShowImage(ImageBase):
  item_image1: Optional[str]
  item_image2: Optional[str]
  item_image3: Optional[str]
  created_date: Optional[datetime]
  updated_date: Optional[datetime]

  # to convert non-dict obj to json
  class Config():
    orm_mode = True