from core.hashing import Hasher
from ..models.user import User
from schemas.user import UserCreate, UserUpdate
from sqlalchemy.orm import Session
from schemas.user import SecurityEnum
from sqlalchemy.exc import IntegrityError
from core.security import create_area_table_entry
from core.communication import email_confirmation_communication_for_email_update
from sqlalchemy import update
import os as _os
import pprint


async def create_new_user(user: UserCreate, db: Session):

    if user['security_name'] == SecurityEnum.BORN_CITY:
        security_name = SecurityEnum.BORN_CITY
    if user['security_name'] == SecurityEnum.MOTHER_MAIDEN_NAME:
        security_name = SecurityEnum.MOTHER_MAIDEN_NAME
    if user['security_name'] == SecurityEnum.FAVORITE_FOOD:
        security_name = SecurityEnum.FAVORITE_FOOD
    if user['security_name'] == SecurityEnum.GRADUATED_HIGH_SCHOOL_NAME:
        security_name = SecurityEnum.GRADUATED_HIGH_SCHOOL_NAME
    if user['security_name'] == SecurityEnum.FAVORITE_PET:
        security_name = SecurityEnum.FAVORITE_PET
    if user['security_name'] == SecurityEnum.FIRST_CAR:
        security_name = SecurityEnum.FIRST_CAR

    user_being_saved = User(
        username=user['username'],
        email=user['email'],
        hashed_password=Hasher.get_hash(user['password']),
        is_active=True,
        is_superuser=False,
        first_name=user['first_name'],
        last_name=user['last_name'],
        security_name=security_name,
        security_answer=Hasher.get_hash(user['security_answer'])
    )
    try:
        db.add(user_being_saved)
        db.flush()
        await create_area_table_entry(user_id=user_being_saved.id, db=db)
        db.commit()
        db.refresh(user_being_saved)
    except IntegrityError as error:
        return IntegrityError(params=[],
                              statement=[],
                              orig="either the email or username already exists and is being used. please, correct the problem(s).")
    return user_being_saved
    # raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="user sign up and required user email confirmation does not match")


async def update_user(user: UserUpdate, current_email: str, username: str, user_id: int, db: Session):

    try:

        if (user["security_answer"] == ""):
            del user['security_name']
            del user['security_answer']

        else:
            if user['security_name'] == SecurityEnum.BORN_CITY:
                user['security_name'] = SecurityEnum.BORN_CITY
            if user['security_name'] == SecurityEnum.MOTHER_MAIDEN_NAME:
                user['security_name'] = SecurityEnum.MOTHER_MAIDEN_NAME
            if user['security_name'] == SecurityEnum.FAVORITE_FOOD:
                user['security_name'] = SecurityEnum.FAVORITE_FOOD
            if user['security_name'] == SecurityEnum.GRADUATED_HIGH_SCHOOL_NAME:
                user['security_name'] = SecurityEnum.GRADUATED_HIGH_SCHOOL_NAME
            if user['security_name'] == SecurityEnum.FAVORITE_PET:
                user['security_name'] = SecurityEnum.FAVORITE_PET
            if user['security_name'] == SecurityEnum.FIRST_CAR:
                user['security_name'] = SecurityEnum.FIRST_CAR
            user['security_answer'] = Hasher.get_hash(user['security_answer'])

        if len(user['password']) != 0:
            user['hashed_password'] = Hasher.get_hash(user['password'])
        # delete password from  regardless of password length
        del user['password']

        if username == user["username"]:
            del user["username"]

        if current_email == user["email"]:
            del user["email"]
            EMAIL_CHANGED = False

        else:
            _user = await email_confirmation_communication_for_email_update(user_id, db, user["email"])
            EMAIL_CHANGED = True
            print("EMAIL_CHANGED")
            del user["email"]

        if len(user) != 0:
            user['is_active'] = True
            user['is_superuser'] = False
            stmt = (update(User).where(User.id == user_id).values(**user))

            pprint.pprint(user)

            db.execute(stmt)

            if user.get("username", None) != None:
                _os.chdir("/home/bilen/Desktop/projects/fastapi/justlikenew/static/images")
                for file in _os.listdir("."):
                    result = file.split(username)
                    print(result)
                    if len(result) > 1:
                        print(result)
                        _os.rename(file, f"{user['username']}{result[1]}")
                db.commit()
                return user["username"], EMAIL_CHANGED

        print("EMAIL_CHANGED ", EMAIL_CHANGED)
        return username, EMAIL_CHANGED

    except Exception as e:
        # if there is an exception occurred, rewinding back renaming of the folders...
        _os.chdir("/home/bilen/Desktop/projects/fastapi/justlikenew/static/images")
        for file in _os.listdir("."):
            result = file.split(user['username'])
            if len(result) > 1:
                # print(result)
                _os.rename(file, f"{username}{result[1]}")
        print("ERROR")
        print(e)


async def update_email_address(proposed_email: str, user_id: int, db: Session):
    try:
        print("id in update_email function", user_id)
        print("proposed_email in update_email function", proposed_email)
        stmt = (update(User).where(User.id == user_id).values(email=proposed_email))
        db.execute(stmt)
        db.commit()
        return 1
    except Exception as e:
        print(e)


def get_user_by_email(email: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    return user
