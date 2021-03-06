import os
from pathlib import Path
from dotenv import load_dotenv

# /home/bilen/Desktop/projects/fastapi/justlikenew/core/config.py
# /home/bilen/Desktop/projects/fastapi/justlikenew/.env
# for testing change the following env_path to something
# env_path = Path("../..") / ".env"

env_path = Path(".") / ".env"
load_dotenv(dotenv_path = env_path)


class Settings:
  PROJECT_NAME: str = "Electronic Item Sales Board"
  PROJECT_VERSION: str = "0.0.1"

  USE_SQLITE_DB: str = os.getenv("USE_SQLITE_DB")
  POSTGRES_USER: str = os.getenv("POSTGRES_USER")
  POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
  POSTGRES_SERVER = os.getenv("POSTGRES_SERVER", "localhost")
  POSTGRES_PORT: str = os.getenv(
    "POSTGRES_PORT", 5432
  ) # default postgres port is 5432
  POSTGRES_DB: str = os.getenv("POSTGRES_DB", "tutorial")
  DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

  SECRET_KEY: str = os.getenv("SECRET_KEY")
  ALGORITHM = "HS256"
  ACCESS_TOKEN_EXPIRE_MINUTES = 120 #in minutes
  # limit per image file
  LIMIT_MB = 10
  TEST_USER_EMAIL = "test@example.com"


settings = Settings()