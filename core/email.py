from fastapi import FastAPI, BackgroundTasks, UploadFile, File, Form
from starlette.responses import JSONResponse
from starlette.requests import Request
from fastapi_mail import FastMail, MessageSchema,ConnectionConfig
from pydantic import BaseModel, EmailStr
from typing import List



class EmailSchema(BaseModel):
    email: List[EmailStr]

conf = ConnectionConfig(
    MAIL_USERNAME = "507f842caa03ea",
    MAIL_PASSWORD = "e7200386093f5a",
    MAIL_FROM = "admin@admin.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.mailtrap.io",
    MAIL_TLS = True,
    MAIL_SSL = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

app = FastAPI()



# @app.post("/email")
async def email_for_sign_up(emails: EmailSchema, subject_line: str, html: str) -> JSONResponse:

    message = MessageSchema(
        subject=subject_line,
        recipients=[emails[0][1]],  # List of recipients, as many as you can pass 
        body=html,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    return JSONResponse(status_code=200, content={"message": "email has been sent"})  