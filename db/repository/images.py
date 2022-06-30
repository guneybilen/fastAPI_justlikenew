from ..models.images import Image
from ..models.items import Item
from ..models.images import Image as _image
from sqlalchemy.orm import Session
import sqlalchemy.sql as _sqlalchemy_sql
import sqlalchemy.sql.functions as _func
from sqlalchemy import delete
from sqlalchemy.inspection import inspect
from fastapi import UploadFile, File
import os as _os

first_image_addition = False
second_image_addition = False
oldest_image_removed = False

def create_necessary_directory(current_user, id):
    _os.chdir("/home/bilen/Desktop/projects/fastapi/justlikenew/static/images")
    if not _os.path.exists(f"/home/bilen/Desktop/projects/fastapi/justlikenew/static/images/{current_user}{id}"):
     _os.mkdir(f"{current_user}{id}")
    _os.chdir(f"/home/bilen/Desktop/projects/fastapi/justlikenew/static/images/{current_user}{id}")

def  check_image_count(record: Image, name: str, db: Session):
      list_of_files = _os.listdir('.')
      if (len(list_of_files) > 3):
        oldest_file = min(list_of_files, key=_os.path.getctime)
        # print(oldest_file)
        # record = db.query(Image).filter_by(id=record.id).limit(1).all() #.update({Image.oldest_file: _func.replace(Image.oldest_file, oldest_file, name)},
            #synchronize_session=False)
        for column in inspect(Image).c:
          # print(column.name)
          column_name = column.name
          interpolated_cloumn_name = "Image" + "." + f"{column_name}"
          # print("Image" + "." + f"{column_name}")
          # column_value = db.query(Image).where(interpolated_cloumn_name = oldest_file).first()
          for value, in db.query(getattr(Image, column_name)):
            if (value == oldest_file):
              print(value)
              img = db.query(Image).where(column_name==value).first()
              print(f"!!!!!!!!!!!!!!!!!!!!!! {img}")
              # to_be_removed = delete(Image).where(value==oldest_file).execution_options(synchronize_session="fetch")
              rt = db.query(Image).filter(Image.id==record.id).update({column_name: name})
              print(rt)
              # if to_be_removed:   
              #  return 0 
              # db.execute(to_be_removed)
              db.commit()
          # image_column_value = "Image"+"."+ f"{column_value}"
          # print(f"!!!!!!!!!!!!!!!!11 {dir(column_value)}")


          
        _os.remove(oldest_file)
        return record
      list_of_files = _os.listdir('.')
      if (len(list_of_files) == 1):
        record.item_image1 = name 
        return record
      if (len(list_of_files) == 2):
        record.item_image2 = name
        return record
      if (len(list_of_files) == 3):
        record.item_image3 = name
        return record
      

def upload_image_by_item_id(id: int, db: Session,  
                            current_user,
                            file: UploadFile = File(...)):
    try:
        create_necessary_directory(current_user, id)     
        file_name = file.filename.replace(" ", "")
        with open(file_name,'wb+') as f:
          # validate_image(len(f))
          f.write(file.file.read())
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
          returned_record = check_image_count(record, f.name, db)
          f.close()
          db.add(returned_record)
          db.commit() 
          db.refresh(returned_record)
          return returned_record

    except Exception as e:
        print(e)

