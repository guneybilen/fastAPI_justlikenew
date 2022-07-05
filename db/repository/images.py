from ..models.images import Image
from ..models.items import Item
from ..models.users import User
from sqlalchemy.orm import Session, contains_eager,joinedload
import sqlalchemy.sql as _sqlalchemy_sql
import sqlalchemy.sql.functions as _func
from sqlalchemy import delete
from sqlalchemy.inspection import inspect
from fastapi import UploadFile, File, HTTPException, status
from core.config import settings as _settings
import os as _os
import re as _re

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
        print(f"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! {oldest_file}")
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
     print(f"incoming image.size is {file_size} bytes")
     limit_MB = _settings.LIMIT_MB
     if file_size > limit_MB * 1024000:
        raise HTTPException(status_code= status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail= "max image size is has to be less than %s MB" % limit_MB)  
     return 0


def upload_image_by_item_id(id: int, db: Session,  
                            current_user,
                            file: UploadFile = File(...),
                            file_size: bytes = File(...)):
    try:
        validate_image(len(file_size))

        create_necessary_directory(current_user, id)     
        file_name = file.filename.replace(" ", "")
        dir_list = _os.listdir(".")

        round_robin = False
        counter = len(dir_list)

        if counter == 3:
          oldest_file = min(dir_list, key=_os.path.getctime)
          regex = _re.search(r'\d+', oldest_file)
          counter = int(regex.group(0)) - 1
          round_robin = True
        counter = counter + 1
        
        with open(file_name,'wb+') as f:
          f.write(file.file.read())
          _os.rename(file_name, f"{counter}.jpeg")
          existing_item = db.query(Item).filter_by(id=id).first()
          existing_image_for_item = db.query(Image).filter_by(item_id=id).first()
          if (existing_image_for_item ==  None):
            image = Image(item_id=id)
            db.add(image)   
            db.commit()

          q = db.query(Image)
          record = q.filter_by(item_id=id).first()
          if not existing_item.id: 
            return 0
          returned_record = check_image_count(record, f"{counter}.jpeg", db, round_robin)
          f.close()
          db.add(returned_record)
          db.commit() 
          db.refresh(returned_record)
          return returned_record

    except Exception as e:
        print(e)

def list_images_with_items(db: Session):
    # query = db.query(Image).filter(Image.id).options(contains_eager(Image.id)).all()
    query = db.query(User).options(joinedload('*')).all()
    return query

def list_images_with_item(id:int, db: Session):
    # query = db.query(Image).filter(Image.id).options(contains_eager(Image.id)).all()
    query = db.query(User).filter_by(id=id).options(joinedload('*')).all()
    return query