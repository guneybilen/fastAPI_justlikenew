from ..models.items import Item
from schemas.items import ItemCreate  
from sqlalchemy.orm import Session 
from sqlalchemy.sql import or_

def create_new_item(item: ItemCreate, db: Session, seller_id: int): 
  item_object = Item(**item.dict(), seller_id=seller_id)
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
