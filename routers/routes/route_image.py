from fastapi import APIRouter, Depends, File, UploadFile
from db.repository.image import upload_image_by_seller_id
# from .route_login import get_current_user_from_token
from core.security import get_current_user_from_token
from schemas.image import ImageCreate, ShowImage

from db.models.user import User

from db.session import get_db
from sqlalchemy.orm import Session


router = APIRouter()

@router.put("/create-image/{id}", response_model=ShowImage)
def create_image( id: int, db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user_from_token),
                 file: UploadFile = File(...),
                 file_size: bytes = File(...)
               ):

               item = upload_image_by_seller_id(  id=id, db=db, 
                                                current_user=current_user.username, 
                                                file=file,
                                                file_size=file_size
                                              )
               return item
