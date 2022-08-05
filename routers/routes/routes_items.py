from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status, Request, Form, Response
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from db.repository.item import update_item_by_id, delete_item_by_id, create_new_item
from db.repository.item import list_items, retrieve_item, search_item
from db.repository.image import list_images_with_items, list_images_with_item, edit_item
from core.security import get_current_user_from_token, check_owner
from schemas.item import ItemBase, ItemCreate, ShowItem
from typing import List
from typing import Optional, Dict, Any
from db.models.user import User
from schemas.user import ShowAllImportantDataAboutUser

from db.session import get_db
from sqlalchemy.orm import Session
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
import datetime

router = APIRouter()
templates = Jinja2Templates(directory="templates")

path = "/home/bilen/Desktop/projects/fastapi/justlikenew"

app = FastAPI()

def add_headers(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    r.headers['Last-Modified'] = str(datetime.datetime.now() - datetime.timedelta(days=365))
    return r

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return PlainTextResponse(str(exc), status_code=400)

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
                  price: Optional[str] = Form(None), 
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


@router.get("/particular_user_items/{id}", response_model=ShowAllImportantDataAboutUser)
def read_item(id: int, db: Session = Depends(get_db)):
  # item = retrieve_item(id=id, db=db)
  # user = db.query(User).filter(User.id==item.seller_id).first()
  item_and_image_names = list_images_with_item(id=id, db=db)
  return item_and_image_names

@router.get("/edit_item/{user_id}/particular_item/{particular_item_id}", response_model=ItemBase)
def read_item(user_id: int, particular_item_id: int, db: Session = Depends(get_db)):
  item_and_image_names = edit_item(user_id= user_id, particular_item_id = particular_item_id, db=db)
  return item_and_image_names

# List[] type in response model is the most important part in order to receive the right answer
# otherwise all data you receive will be resulted in nulls.
# https://stackoverflow.com/questions/70634056/problem-with-python-fastapi-pydantic-and-sqlalchemy
@router.get("/total/collection/all", response_model=list[ShowAllImportantDataAboutUser], response_model_exclude_none=True)
def read_items(req: Request, resp: Response, db: Session = Depends(get_db)):
  try:
    resp = add_headers(resp)
    items = list_images_with_items(db=db)
    json_compatible_item_data = jsonable_encoder(items)
    return JSONResponse(content=json_compatible_item_data, headers=resp.headers)
  except KeyError as e:
    print(e)


@router.patch("/single/update/{particular_item_id}")
async def update_item(req: Request, particular_item_id: int,
                  brand: str = Form(),
                  location: Optional[str] = Form(None),  
                  description: Optional[str] = Form(None),
                  price: Optional[float] = Form(None), 
                  model: Optional[str] = Form(None),
                  db: Session = Depends(get_db)):

                try:
                  current_user_or_access_token_error = await get_current_user_from_token(access_token= req.headers['access_token'], db=db)
                  print('current_user_or_access_token_error ', current_user_or_access_token_error)

                  message = update_item_by_id(id=particular_item_id, db=db, 
                                              seller_id=current_user_or_access_token_error.id, 
                                              brand=brand, price=price, location=location, model=model,description=description)
                  print('message ', message)
                  if message is None:
                    raise HTTPException(
                      status_code=status.HTTP_404_NOT_FOUND,
                      detail=f"Item with id {id} not found")
                  return {"msg": "Successfully updated data"}

                except HTTPException as e:
                  print(e)




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



