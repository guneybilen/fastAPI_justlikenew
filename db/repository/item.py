from ..models.item import Item
from ..models.user import User
from schemas.item import ItemCreate 
from schemas.image import ImageCreate   
from sqlalchemy.orm import Session 
from sqlalchemy.sql import or_
from core.config import settings
from fastapi import HTTPException, status, Depends, UploadFile, File
# from routers.routes.route_login import get_current_user_from_token
from core.security import get_current_user_from_token
import os as _os

def validate_image(image_size: int):
    # print(image_size)
    print (f"The input file is {image_size} bytes long")
    limit_MB = settings.LIMIT_MB
    if (image_size > limit_MB * 1024000):
        raise HTTPException(stattus_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail="max image size is has to be less than %s MB" % limit_MB)

def create_new_item(item: ItemCreate, 
                    db: Session, 
                    seller_id: int,
                    current_user: User = Depends(get_current_user_from_token)): 
  
    item_object = Item( brand = item.brand,
                        model = item.model,
                        location = item.location, 
                        description = item.description,
                        price = item.price, 
                        seller_id = seller_id
                     )
    db.add(item_object)
    db.commit() 
    db.refresh(item_object) 
    return item_object

def retrieve_item(id: int, db: Session):
  item = db.query(Item).filter(Item.id==id).first()  
  return item  

def list_items(db: Session):  
  items = db.query(Item).all() 
  return items  

def update_item_by_id(id: int, item: ItemCreate, db: Session, seller_id):
  existing_item = db.query(Item).filter(Item.id == id)  
  if not existing_item.first(): 
    return 0 

  item.__dict__.update(seller_id=seller_id)
  existing_item.update(item.__dict__) 
  db.commit() 
  return 1  

    
def delete_item_by_id(id: int, db: Session, seller_id):
  existing_item = db.query(Item).filter(Item.id == id)  
  if not existing_item.first():   
    return 0 
  existing_item.delete(synchronize_session = False)  
  db.commit()  
  return 1 

def search_item(query: str, db: Session):   
  item_description = db.query(Item).filter(Item.description.contains(query))   
  return item_description    
