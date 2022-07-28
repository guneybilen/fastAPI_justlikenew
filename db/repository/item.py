from ..models.item import Item
from ..models.user import User
from ..models.image import Image
from schemas.item import ItemBase, ItemCreate 
from schemas.image import ImageCreate   
from sqlalchemy.orm import Session 
from sqlalchemy.sql import or_
from core.config import settings
from fastapi import HTTPException, status, Depends, UploadFile, File
# from routers.routes.route_login import get_current_user_from_token
from core.security import get_current_user_from_token
import os as _os
from sqlalchemy.orm import Session
from db.repository.image import upload_image_by_item_id


def validate_image(image_size: int):
    # print(image_size)
    print (f"The input file is {image_size} bytes long")
    limit_MB = settings.LIMIT_MB
    if (image_size > limit_MB * 1024000):
        raise HTTPException(stattus_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail="max image size is has to be less than %s MB" % limit_MB)

def create_new_item(item_object: ItemBase, 
                    db: Session, 
                    current_user: User): 

    user = db.query(User).filter(User.id==current_user.id).first()
    # print('brand', item)

    item_object_to_be_created = Item( brand = item_object["brand"],
                        model = item_object["model"],
                        location = item_object["location"], 
                        description = item_object["description"],
                        price = item_object["price"], 
                        seller_id = current_user.id)

    db.add(item_object_to_be_created)
    db.flush()

    for i in range(1,4):
      if(item_object[f"item_image{i}b"]) is not None:
        upload_image_by_item_id(id= item_object_to_be_created.id, 
                              db=db, current_user=current_user.username, 
                              file = item_object[f"item_image{i}b"], 
                              file_size = item_object[f"item_image{i}a"])



    db.commit() 
    return [True, item_object_to_be_created.id]

def retrieve_item(id: int, db: Session):
  item = db.query(Item).filter(Item.id==id).first()  
  return item  

def list_items(db: Session):  
  items = db.query(Item).all() 
  return items  

def update_item_by_id(id: int, item: ItemCreate, db: Session, seller_id):
  try:
    existing_item = db.query(Item).filter(Item.id == id).one_or_none() 
    item.__dict__.update(seller_id=seller_id)
    existing_item.update(item.__dict__) 
    db.commit() 
    return 1  
  except Exception as e:
    print(e)

    
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
