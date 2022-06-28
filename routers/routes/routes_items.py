from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.templating import Jinja2Templates
from db.repository.items import update_item_by_id, delete_item_by_id, create_new_item
from db.repository.items import list_items, retrieve_item, search_item
from .route_login import get_current_user_from_token
from schemas.items import ItemCreate, ShowItem
from typing import List
from typing import Optional
from db.models.users import User
from db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.post("/create-item", response_model=ShowItem)
def create_item(item: ItemCreate, 
               db: Session = Depends(get_db), 
               current_user: User = Depends(get_current_user_from_token)):

               item = create_new_item(item=item, db=db, owner_id=current_user.id)
               return item


# if we keep just "{id}". it would start catching all routes
@router.get("/get/{id}", response_model=ShowItem)
def read_item(id: int, db: Session = Depends(get_db)):
  item = retrieve_item(id=id, db=db)
  
  if not item:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
    detail=f"Item with this id {id} not found")

  return item


@router.get("/all", response_model=List[ShowItem])
def read_items(db: Session = Depends(get_db)):
  items = list_items(db=db)
  return items


@router.put("/update/{id}")
def update_item(id: int, item: ItemCreate, db: Session = Depends(get_db)):
  current_user = 1
  message = update_item_by_id(id=id, item=item, db=db, owner_id=current_user)
  
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
  print(item.owner_id, current_user.id, current_user.is_superuser)
  if item.owner_id == current_user.id or current_user.is_superuser:
    delete_item_by_id(id=id, db=db, seller_id=current_user.id)
    return {"detail": "Successfully deleted"}
  raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not permitted")


@router.get("/autocomplete")
def autocomplete(term: Optional[str] = None, db: Session = Depends(get_db)):
  items = search_item(term, db=db)
  item_titles = []
  for item in items:
    item_titles.append(item.title)
  return item_titles



