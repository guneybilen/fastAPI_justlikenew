from typing import Optional
from pydantic import BaseModel
from typing import List, Union
 
# shared properties
class ImageBase(BaseModel):
  item_image1: Union[str, None] = None
  item_image2: Union[str, None] = None
  item_image3: Union[str, None] = None
  
  class Config:
    orm_mode = True


class ImageCreate(ImageBase):
  pass

# this will be used to format the response to not to have id, owner_id etc
class ShowImage(ImageBase):
  item_image1: Union[str, None] = None
  item_image2: Union[str, None] = None
  item_image3: Union[str, None] = None

  # to convert non-dict obj to json
  class Config():
    orm_mode = True