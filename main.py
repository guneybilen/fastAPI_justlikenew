from db.utils import check_db_connected, check_db_disconnected
from routers.base_router import api_router
from core.config import settings
from db.base_db import Base
from db.session import engine
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
# from webapps.base import api_router as web_app_router
from fastapi.middleware.cors import CORSMiddleware
import os as _os

# origins = ["http://localhost:3000", "http://localhost:3000/login", "http://localhost:8000"]
origins = ["*"]


def include_router(app):
  app.include_router(api_router)
#  app.include_router(web_app_router)


def configure_static(app):
  # note to self: check_dir below is utmost important. cures broken images on reactjs side... 
  app.mount("/pictures", StaticFiles(directory="./pictures/images", check_dir=True), name="pictures")


def create_tables():
  print("databases would be created at this point, but we are using alembic tool now.")
  # Base.metadata.create_all(bind=engine)


def start_application():
  app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)
  app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )
  include_router(app)
  configure_static(app)
  create_tables()
  return app


app = start_application()


@app.on_event("startup")
async def app_startup():
  await check_db_connected()


@app.on_event("shutdown")
async def app_shutdown():
  await check_db_disconnected()
