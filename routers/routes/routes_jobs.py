from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.templating import Jinja2Templates
from db.repository.jobs import update_job_by_id, delete_job_by_id, create_new_job
from db.repository.jobs import list_jobs, retrieve_job, search_job

from route_login import get_current_user_from_token
from schemas.jobs import JobCreate, ShowJob

from typing import List
from typing import Optional

from db.models.users import User

from db.session import get_db

from sqlalchemy.orm import Session

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.post("/create-job", response_model=ShowJob)
def create_job(job: JobCreate, 
               db: Session = Depends(get_db), 
               current_user: User = Depends(get_current_user_from_token)):

               job = create_new_job(job=job, db=db, owner_id=current_user.id)
               return job


# if we keep just "{id}". it would start catching all routes
@router.get("/get/{id}", response_model=ShowJob)
def read_job(id: int, db: Session = Depends(get_db)):
  job = retrieve_job(id=id, db=db)
  
  if not job:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
    detail=f"Job with this id {id} not found")

  return job

@router.get("/all", response_model=List[ShowJob])
def read_jobs(db: Session = Depends(get_db)):
  jobs = list_jobs(db=db)
  return jobs

@router.put("/update/{id}")
def update_job(id: int, job: JobCreate, db: Session = Depends(get_db)):
  current_user = 1
  message = update_job_by_id(id=id, job=job, db=db, owner_id=current_user)
  
  if not message:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=f"Job with id {id} not found"
    )

  return {"msg": "Successfully updated data"}


@router.delete_job("/delete/{id}")
def delete_job(id: int,
               db : Session = Depends(get_db),
              current_user: User = Depends(get_current_user_from_token)):

  job = retrieve_job(id=id, db=db)
  if not job: 
    return HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail=f"Job with id {id} not found"
    )
  print(job.owner_id, current_user.id, current_user.is_superuser)
  if job.owner_id == current_user.id or current_user.is_superuser:
    delete_job_by_id(id=id, db=db, owner=current_user.id)
    return {"detail": "Successfully deleted"}
  raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not permitted")

@router.get("/autocomplete")
def autocomplete(term: Optional[str] = None, db: Session = Depends(get_db)):
  jobs = search_job(term, db=db)
  job_titles = []
  for job in jobs:
    job_titles.append(job.title)
  return job_titles



