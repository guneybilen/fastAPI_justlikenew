from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel
from schemas.image import ShowImage
from datetime import datetime
from fastapi import UploadFile, Form
 
# shared properties
class ItemBase(BaseModel):
  def __init__(
    self,
    brand: Optional[str] = Form(...),
    model: Optional[str] = Form(...),
    location: Optional[str] = Form(...),
    description: Optional[str] = Form(...),
    price: Optional[str] = Form(...),
    item_image1: Optional[UploadFile] = Form(...),
    item_image2: Optional[UploadFile] = Form(...),
    item_image3: Optional[UploadFile] = Form(...),
):

   self.brand = brand
   self.model = model
   self.location = location
   self.description = description
   self.price = price
   self.item_image1 = item_image1
   self.item_image2 = item_image2
   self.item_image3 = item_image3
  
  class Config:
    orm_mode = True
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
  price: Optional[float]
  created_date: Optional[datetime]
  updated_date: Optional[datetime]
  seller_id: Optional[int]
  images: Optional[list[ShowImage]]

  # to convert non-dict obj to json
  class Config():
    orm_mode = True