from core.hashing import Hasher  
from ..models.users import User    
from schemas.users import UserCreate 
from sqlalchemy.orm import Session  
from passlib.hash import bcrypt

def create_new_user(user: UserCreate, db: Session):
  user_being_saved = User(
        username=user.username,
        email=user.email,
        hashed_password=Hasher.get_hash(user.password),
        is_active=True,
        is_superuser=False,
        first_name=user.first_name,
        last_name=user.last_name,
        s_name=user.s_name,
        s_answer=Hasher.get_hash(user.s_answer)
  )
  db.add(user_being_saved)
  db.commit() 
  db.refresh(user_being_saved)
  return user_being_saved

def get_user_by_email(email: str, db: Session):
  user= db.query(User).filter(User.email == email).first() 
  return user