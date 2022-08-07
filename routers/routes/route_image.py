from fastapi import APIRouter, Depends, File, UploadFile
from db.repository.image import upload_image_by_item_id, update_image_by_item_id
# from .route_login import get_current_user_from_token
from core.security import get_current_user_from_token
from schemas.image import ImageCreate, ShowImage

from db.models.user import User

from db.session import get_db
from sqlalchemy.orm import Session

from fastapi import Request, HTTPException, status



router = APIRouter()

@router.put("/create-image/{id}", response_model=ShowImage)
def create_image(req: Request, id: int, db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user_from_token),
                 file: UploadFile = File(...),
                 file_size: bytes = File(...)
               ):

               item = upload_image_by_item_id(  req=req,  
                                                id=id, 
                                                db=db, 
                                                current_user=current_user.username, 
                                                file=file,
                                                file_size=file_size
                                              )
               return item


@router.patch("/single/update/{particular_item_id}")
async def update_image(  req: Request, 
                         particular_item_id: int,
                         item_image1a: bytes | None = File(default=None),
                         item_image1b: UploadFile | None = File(default=None),
                         item_image2a: bytes | None = File(default=None),
                         item_image2b: UploadFile | None = File(default=None),
                         item_image3a: bytes | None = File(default=None),
                         item_image3b: UploadFile | None = File(default=None),
                         db: Session = Depends(get_db)
                       ):
               
                item_object = {
                  "item_image1a": item_image1a,
                  "item_image1b": item_image1b,
                  "image1ExtraData": req.headers.get('image1ExtraData'),
                  "item_image2a": item_image2a,
                  "item_image2b": item_image2b,
                  "image2ExtraData": req.headers.get('image2ExtraData'),
                  "item_image3a": item_image3a,
                  "item_image3b": item_image3b,
                  "image3ExtraData": req.headers.get('image3ExtraData')
              }

                try:
                  current_user_or_access_token_error = await get_current_user_from_token(access_token= req.headers['access_token'], db=db)
                  print('current_user_or_access_token_error ', current_user_or_access_token_error)

                  message = update_image_by_item_id(  id=particular_item_id, 
                                                      db=db, 
                                                      seller_username=current_user_or_access_token_error.username, 
                                                      item_object=item_object
                                                    )
                                              
                  print('message ', message)
                  if message is None:
                    raise HTTPException(
                      status_code=status.HTTP_404_NOT_FOUND,
                      detail=f"Item with id {id} not found")
                  return {"msg": "Successfully updated data"}

                except HTTPException as e:
                  print(e)
