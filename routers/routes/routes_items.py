from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status, Request, Form, Body

from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse
from db.repository.item import update_item_by_id, delete_item_by_id, create_new_item
from db.repository.item import list_items, retrieve_item, search_item
from db.repository.image import list_images_with_items, list_images_with_item
from core.security import get_current_user_from_token, check_owner
from schemas.item import ItemBase, ItemCreate, ShowItem
from typing import List
from typing import Optional, Dict, Any
from db.models.user import User
from schemas.user import ShowAllImportantDataAboutUser

from db.session import get_db
from sqlalchemy.orm import Session
import os as _os
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
import itertools

router = APIRouter()
templates = Jinja2Templates(directory="templates")

path = "/home/bilen/Desktop/projects/fastapi/justlikenew"

app = FastAPI()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return PlainTextResponse(str(exc), status_code=400)

# @router.post("/create-item/", response_model=ShowItem)
@router.post("/create-item/")
async def create_item(req: Request,
                  item_image1a: bytes | None = File(default=None),
                  item_image1b: UploadFile | None = File(default=None),
                  item_image2a: bytes | None = File(default=None),
                  item_image2b: UploadFile | None = File(default=None),
                  item_image3a: bytes | None = File(default=None),
                  item_image3b: UploadFile | None = File(default=None),
                  brand: str = Form(),
                  location: Optional[str] = Form(None),  
                  description: Optional[str] = Form(None),
                  price: Optional[float] = Form(None), 
                  model: Optional[str] = Form(None),
                 
                  db: Session = Depends(get_db)):

                current_user_or_access_token_error = await get_current_user_from_token(access_token= req.headers['access_token'], db=db)

                if(current_user_or_access_token_error=="access_token_error"):
                  return {'access_token': 'access_token_error'}


                item_object = {
                  "brand": brand,
                  "price": price,
                  "location": location,
                  "model": model,
                  "description": description,
                  "item_image1a": item_image1a,
                  "item_image1b": item_image1b,
                  "item_image2a": item_image2a,
                  "item_image2b": item_image2b,
                  "item_image3a": item_image3a,
                  "item_image3b": item_image3b,
                }


                boolean_result, item_id = create_new_item(item_object=item_object, db=db, 
                                      current_user=current_user_or_access_token_error) 

                return { "result": boolean_result, "item_id": item_id}


@router.get("/particular/{id}", response_model=ShowAllImportantDataAboutUser)
def read_item(id: int, db: Session = Depends(get_db)):
  item = retrieve_item(id=id, db=db)
  user = db.query(User).filter(User.id==item.seller_id).first()
  item_and_image_names = list_images_with_item(id=id, db=db)
  return item_and_image_names



# List[] type in response model is the most important part in order to receive the right answer
# otherwise all data you receive will be resulted in nulls.
# https://stackoverflow.com/questions/70634056/problem-with-python-fastapi-pydantic-and-sqlalchemy
@router.get("/total/collection/all", response_model=list[ShowAllImportantDataAboutUser], response_model_exclude_none=True)
def read_items(req: Request, db: Session = Depends(get_db)):
  try:
    access_token = req.headers['access_token']
    owner = check_owner(access_token_for_id_check=access_token, db=db)
    items = list_images_with_items(db=db)
    if owner is not None:
      items.append({"owner": owner})
    return items
  except KeyError as e:
    print(e)


@router.put("/single/update/{id}")
def update_item(id: int,
                  item_image1a: bytes | None = File(default=None),
                  item_image1b: UploadFile | None = File(default=None),
                  item_image2a: bytes | None = File(default=None),
                  item_image2b: UploadFile | None = File(default=None),
                  item_image3a: bytes | None = File(default=None),
                  item_image3b: UploadFile | None = File(default=None),
                  brand: str = Form(),
                  location: Optional[str] = Form(None),  
                  description: Optional[str] = Form(None),
                  price: Optional[float] = Form(None), 
                  model: Optional[str] = Form(None),
                  db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_user_from_token)):

                  print('description ', description)
                  
                  item_object = {
                    "brand": brand,
                    "price": price,
                    "location": location,
                    "model": model,
                    "description": description,
                    "item_image1a": item_image1a,
                    "item_image1b": item_image1b,
                    "item_image2a": item_image2a,
                    "item_image2b": item_image2b,
                    "item_image3a": item_image3a,
                    "item_image3b": item_image3b,
                }


                  return None

                  # message = update_item_by_id(id=id, item=item_object, db=db, seller_id=current_user.id)
                    
                  # if not message:
                  #   raise HTTPException(
                  #     status_code=status.HTTP_404_NOT_FOUND,
                  #     detail=f"Item with id {id} not found"
                  #   )

                  # return {"msg": "Successfully updated data"}


@router.delete("/collection/all/item/{id}")
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



