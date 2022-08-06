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
from core.config import settings as _settings
import os as _os
from datetime import datetime, timezone
from sqlalchemy import update
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


# def upload_image_by_item_id(id: int, db: Session,  
#                             current_user: str,
#                             file: UploadFile = File(...),
#                             file_size: bytes = File(...)):
#     try:
#         validate_image(len(file_size))

#         create_necessary_directory(current_user, id)     
#         file_name = file.filename.replace(" ", "")
#         dir_list = _os.listdir(".")

#         round_robin = False
#         counter = len(dir_list)

#         if counter == 3:
#           oldest_file = min(dir_list, key=_os.path.getctime)
#           regex = _re.search(r'\d+', oldest_file)
#           counter = int(regex.group(0)) - 1
#           round_robin = True
#         counter = counter + 1
        
#         with open(file_name,'wb+') as f:
#           f.write(file.file.read())
#           _os.rename(file_name, f"{counter}.jpeg")
#           existing_item = db.query(Item).filter_by(id=id).first()
#           existing_image_for_item = db.query(Image).filter_by(item_id=id).first()
#           if (existing_image_for_item ==  None):
#             image = Image(item_id=id)
#             db.add(image)   
#             db.commit()

#           q = db.query(Image)
#           record = q.filter_by(item_id=id).first()
#           if not existing_item.id: 
#             return 0
#           returned_record = check_image_count(record, f"{counter}.jpeg", db, round_robin)
#           f.close()
#           db.add(returned_record)
#           db.commit() 
#           db.refresh(returned_record)
#           return returned_record

#     except Exception as e:
#         print(e)

def upload_image_by_item_id(  req, 
                              id: int, 
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
        # print('BASE_DIR', BASE_DIR)
        # static/images/bilen9
        # directory = f"{current_user}"f"{id}"
        
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
          db.query(Item).filter_by(id=id).first()
          if (int(imageExtraData) == 1):
                stmt = (update(Image).where(Image.item_id==id).values(item_image1=file_image_name))
                db.execute(stmt)
                db.commit()
          if (int(imageExtraData) == 2):
                stmt = (update(Image).where(Image.item_id==id).values(item_image2=file_image_name))
                db.execute(stmt)
                db.commit()
          if (int(imageExtraData) == 3):
                stmt = (update(Image).where(Image.item_id==id).values(item_image3=file_image_name))
                db.execute(stmt)
                db.commit()
        return True

    except Exception as e:
      print(e)


def list_images_with_items(db: Session):
    query = db.query(User).options(joinedload('*')).all()
    return query


def list_images_with_item(id:int, db: Session):
    # query = db.query(Item).options(joinedload(Item.image, innerjoin=True), contains_eager('image.items')).one()
    # query = db.query(User).options(joinedload(User.item, innerjoin=True), contains_eager('item.users')).one()
    query = db.query(User).options(joinedload(User.item, innerjoin=True)).filter(User.id == id).first()
    # query = db.query(Item).filter(Item.id == id).options(joinedload(Item.image, innerjoin=True), contains_eager('image.items')).one()
    return query


def edit_item(user_id: int, particular_item_id: int, db: Session):
    # query = db.query(Item).filter(Item.id == particular_item_id).first()
    # query = db.query(Item).filter(Item.id == particular_item_id).options(joinedload(Item.image, innerjoin=True), contains_eager('image.items')).one()
    query = db.query(Item).get(particular_item_id)
    # print(query.id)
    return query


def update_image_by_item_id(req, id: int, db: Session, seller_username: str,  
                                        item_object):

    try: 
      for i in range(1,4):
        if(item_object[f"item_image{i}b"]) is not None:
          upload_image_by_item_id(req, 
                                  id=id, 
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