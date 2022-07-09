
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/login/token",
    scopes={"me": "Read information about the current user.", "items": "Read items."})
