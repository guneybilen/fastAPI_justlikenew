from ..models.image import Image
from ..models.item import Item
from ..models.user import User
from ..models.limit import Limit
from ..models.area import Area
from sqlalchemy.orm import Session, contains_eager,joinedload
import sqlalchemy.sql as _sqlalchemy_sql
import sqlalchemy.sql.functions as _func
from sqlalchemy import delete
from sqlalchemy.inspection import inspect
from fastapi import UploadFile, File, HTTPException, status
from sqlalchemy.dialects.postgresql import insert
from core.config import settings as _settings
import os as _os
from datetime import datetime, timezone
from sqlalchemy import update
from sqlalchemy import text
from pathlib import Path
import re
 
def timestamp(dt):
  return dt.replace(tzinfo=timezone.utc).timestamp() * 1000
   

first_image_addition = False
second_image_addition = False
oldest_image_removed = False


def create_necessary_directory(current_user: str, id: int):
    _os.chdir("/home/bilen/Desktop/projects/fastapi/justlikenew/static/images")
    if not _os.path.exists(f"/home/bilen/Desktop/projects/fastapi/justlikenew/static/images/{current_user}{id}"):
     _os.mkdir(f"{current_user}{id}")
    _os.chdir(f"/home/bilen/Desktop/projects/fastapi/justlikenew/static/images/{current_user}{id}")


def  check_image_count(record: Image, name: str, db: Session, round_robin = bool):
      oldest_file = ""
      list_of_files = _os.listdir('.')
      if (len(list_of_files) > 3):
        oldest_file = min(list_of_files, key=_os.path.getctime)
        for column in inspect(Image).c:
          column_name = column.name
          for value, in db.query(getattr(Image, column_name)):
            if (value == oldest_file):
              db.query(Image).filter(Image.id==record.id).update({column_name: name})
              db.commit()

        _os.remove(oldest_file)
        return record
      list_of_files = _os.listdir('.')
      if (len(list_of_files) == 1):
        record.item_image1 = name 
        return record
      if (len(list_of_files) == 2):
        record.item_image2 = name
        return record
      if (len(list_of_files) == 3 and round_robin == False):
        record.item_image3 = name
        return record
      return record

def validate_image(file_size):
     #  print(f"incoming image.size is {file_size} bytes")
     limit_MB = _settings.LIMIT_MB
     if file_size > limit_MB * 1024000:
        raise HTTPException(status_code= status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail= "max image size is has to be less than %s MB" % limit_MB)  
     return 0


def upload_image_by_item_id(  id: int, 
                              db: Session,  
                              current_user: str,
                              file: UploadFile = File(...),
                              file_size: bytes = File(...),
                              imageExtraData: int | None = None
                            ):

    try:
        dt = datetime.now()
        validate_image(len(file_size))

        create_necessary_directory(current_user, id) 

        file_name = file.filename.replace(" ", "")

        BASE_DIR = Path('./image.py').resolve().parent

        print("imageExtraData ", imageExtraData)
        
        for filename in _os.listdir(BASE_DIR):
          f = _os.path.join(BASE_DIR, filename)
          if _os.path.isfile(f):
            m = re.findall(r'(\d)-\d+', f)
            if(len(m)>0):
              if (m[0] == imageExtraData):
                t = re.findall(r".*", f)
                image_file_name = f"{t[0]}"
                _os.remove(image_file_name)          

        with open(file_name,'wb+') as f:
          f.write(file.file.read())
          file_image_name = f"{imageExtraData}-{timestamp(dt)}.jpeg"
          _os.rename(file_name, file_image_name)
          if (int(imageExtraData) == 1):
            insert_stmt = insert(Image).values(
              item_id=id,
              item_image1=file_image_name
            )
            do_update_stmt = insert_stmt.on_conflict_do_update(
              index_elements=['item_id'],
              set_=dict(item_image1=file_image_name),
            )
            db.execute(do_update_stmt)
            db.commit()
          if (int(imageExtraData) == 2):
            insert_stmt = insert(Image).values(
              item_id=id,
              item_image2=file_image_name
            )
            do_update_stmt=insert_stmt.on_conflict_do_update(
              index_elements=['item_id'],
              set_=dict(item_image2=file_image_name)
            )
            db.execute(do_update_stmt)
            db.commit()
          if (int(imageExtraData) == 3):
            insert_stmt = insert(Image).values(
              item_id=id,
              item_image3=file_image_name
            )
            do_update_stmt = insert_stmt.on_conflict_do_update(
              index_elements=['item_id'],
              set_=dict(item_image3=file_image_name)
            )
            db.execute(do_update_stmt)
            db.commit()
        return True

    except Exception as e:
      print(e)


def list_images_with_items(db: Session):
    query = db.query(User).options(joinedload('*')).order_by(text("item_1.updated_date desc")).all()
    return query


def list_images_with_item(id:int, db: Session):
    query = db.query(User).join(User.item).filter(Item.id == id).one_or_none()
    return query

def user_all_items(id:int, db: Session):
    query = db.query(User).join(User.item).filter(User.id == id).one_or_none()
    return query

def edit_item(user_id: int, particular_item_id: int, db: Session):
    query = db.query(Item).get(particular_item_id)
    return query


def update_image_by_item_id(  id: int, 
                              db: Session, 
                              seller_username: str,  
                              item_object
                           ):

    try: 
      for i in range(1,4):
        if(item_object[f"item_image{i}b"]) is not None:
          upload_image_by_item_id(  id=id, 
                                    db=db, 
                                    current_user=seller_username, 
                                    file = item_object[f"item_image{i}b"], 
                                    file_size = item_object[f"item_image{i}a"],
                                    imageExtraData = item_object[f"image{i}ExtraData"]
                                )
      return 1
    except Exception as e:
      print(e)
      return None