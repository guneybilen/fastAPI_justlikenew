from .routes import routes_items, route_login, route_user, route_image
from fastapi import APIRouter

api_router = APIRouter()

api_router.include_router(route_user.router, prefix="/users", tags=["users"])
api_router.include_router(routes_items.router, prefix="/items", tags=["items"])
api_router.include_router(route_image.router, prefix="/image", tags=["images"])
api_router.include_router(route_login.router, prefix="/login", tags=["login"])
