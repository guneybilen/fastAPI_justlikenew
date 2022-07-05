from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse
from db.repository.items import update_item_by_id, delete_item_by_id, create_new_item
from db.repository.items import list_items, retrieve_item, search_item
from db.repository.images import list_images_with_items, list_images_with_item
from .route_login import get_current_user_from_token
from schemas.items import ItemCreate, ShowItem
from typing import List
from typing import Optional
from db.models.users import User
from schemas.users import ShowAllImportantDataAboutUser

from db.session import get_db
from sqlalchemy.orm import Session
import os as _os

router = APIRouter()
templates = Jinja2Templates(directory="templates")

path = "/home/bilen/Desktop/projects/fastapi/justlikenew"


@router.post("/create-item", response_model=ShowItem)
def create_item( item: ItemCreate, 
                 db: Session = Depends(get_db), 
                 current_user: User = Depends(get_current_user_from_token)):

               item = create_new_item(item=item, db=db, 
                                      seller_id=current_user.id, 
                                      current_user=current_user.username) 
                                     
               return item



# if we keep just "{id}". it would start catching all routes
# @router.get("/items/{id}", response_model=ShowItem)
@router.get("/items/{id}", response_model=List[ShowAllImportantDataAboutUser])
def read_item(id: int, db: Session = Depends(get_db)):
  # item = retrieve_item(id=id, db=db)

  # user = db.query(User).filter(User.id==item.seller_id).first()

  # file_path1 = _os.path.join(path, f"static/images/{user.username}/{item.item_image1}.jpg")
  # file_path2 = _os.path.join(path, f"static/images/{user.username}/{item.item_image2}.jpg")
  # file_path3 = _os.path.join(path, f"static/images/{user.username}/{item.item_image3}.jpg")
 
  # if not item:
  #   raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
  #   detail=f"Item with this id {id} not found")

  # if _os.path.exists(file_path1 or file_path2 or file_path3):
  #   return {"item": item, "images": FileResponse([file_path1, file_path2, file_path3])}
  # return item
  images_item = list_images_with_item(id=id, db=db)
  return images_item



# List[] type in response model is the most important part in order to receive the right answer
# otherwise all data you receive will be resulted in nulls.
# https://stackoverflow.com/questions/70634056/problem-with-python-fastapi-pydantic-and-sqlalchemy
@router.get("/all", response_model=List[ShowAllImportantDataAboutUser])
def read_items(db: Session = Depends(get_db)):
  images_items = list_images_with_items(db=db)
  return images_items


@router.put("/update/{id}")
def update_item(id: int, item: ItemCreate, 
                db: Session = Depends(get_db), 
                current_user: User = Depends(get_current_user_from_token)):

  message = update_item_by_id(id=id, item=item, db=db, seller_id=current_user.id)
  
  if not message:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=f"Item with id {id} not found"
    )

  return {"msg": "Successfully updated data"}


@router.delete("/delete/{id}")
def delete_item(id: int,
                db : Session = Depends(get_db),
                current_user: User = Depends(get_current_user_from_token)):

  item = retrieve_item(id=id, db=db)
  
  if not item: 
    return HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=f"Item with id {id} not found"
    )
  print(item.seller_id, current_user.id, current_user.is_superuser)
  if item.seller_id == current_user.id or current_user.is_superuser:
    delete_item_by_id(id=id, db=db, seller_id=current_user.id)
    return {"detail": "Successfully deleted"}
  raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not permitted")


@router.get("/autocomplete")
def autocomplete(term: Optional[str] = None, db: Session = Depends(get_db)):
  items = search_item(term, db=db)
  item_properties = []
  for item in items:
    item_properties.append(item.description)
  return item_properties



