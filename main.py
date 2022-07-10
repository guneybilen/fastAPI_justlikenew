from db.utils import check_db_connected, check_db_disconnected
from routers.base_router import api_router
from core.config import settings
from db.base_db import Base
from db.session import engine
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
# from webapps.base import api_router as web_app_router
from fastapi.middleware.cors import CORSMiddleware

origins = ["http://localhost:3000"]


def include_router(app):
  app.include_router(api_router)
#  app.include_router(web_app_router)


def configure_static(app):
  app.mount("/static", StaticFiles(directory="static"), name="static")


def create_tables():
  print("databases being created")
  Base.metadata.create_all(bind=engine)


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
