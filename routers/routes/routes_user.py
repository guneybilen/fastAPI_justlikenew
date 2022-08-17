from xml.dom.minidom import Attr
from schemas.user import ShowUser, SecurityEnum, UserCreate, UserPreCreate, UserUpdate
from schemas.user import SecurityEnum, PasswordUpdate
from fastapi import APIRouter, Depends, Form
from db.session import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
from core.communication import communicate_for_forgotten_password
from core.communication import email_confirmation_communication_for_precreate_user
from core.security import get_current_user_from_token, get_current_user_from_token_during_signup, create_acess_token_and_create_limit_table_entry
from core.security import get_current_user_from_token_with_user_id
from db.session import get_db
from db.repository.user import create_new_user, update_user, update_email_address
from db.models.user import User
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from fastapi import FastAPI, Request
from email_validator import validate_email, EmailNotValidError
from schemas.user import ShowUser, UserResponse
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from pathlib import Path
import os as _os
from core.security import logout_user
from core.hashing import Hasher
from sqlalchemy import update


env_path = Path(".") / ".env"
load_dotenv(dotenv_path=env_path)


router = APIRouter()

app = FastAPI()


@router.post("/precreate")
async def pre_create_user(user: UserPreCreate, db: Session = Depends(get_db)):
    user = await email_confirmation_communication_for_precreate_user(user=user, db=db)
    if user == False:
        return {"result": "this email is found in the database. <br />please, enroll with another email."}
    else:
        return {"result": "please, check your email inbox <br />for completing your signup procedure..."}


@router.get("/signup/{access_token}", response_class=RedirectResponse)
async def check_user(access_token: str, db: Session = Depends(get_db)):
    current_user = await get_current_user_from_token_during_signup(access_token, db)
    try:
        if (current_user == "expired_access_token_during_signup"):
            raise AttributeError
        app.state.current_user = current_user
        return RedirectResponse(f"{_os.getenv('FRONT_END_URL')}/signup", status_code=status.HTTP_302_FOUND)
    except AttributeError as e:
        return RedirectResponse(f"{_os.getenv('FRONT_END_URL')}/Error", status_code=status.HTTP_302_FOUND)


@router.get("/create_procedure")
async def create_procedure():
    return {"email": app.state.current_user}


@router.post("/forgot_password_request_email")
async def forgot_password(user: UserPreCreate):

    try:
        # Validate & take the normalized form of the email
        # address for all logic beyond this point (especially
        # before going to a database query where equality
        # does not take into account normalization).
        email = validate_email(user.email).email
        returned_boolean_result = await communicate_for_forgotten_password(email)
        print(returned_boolean_result)
        if returned_boolean_result:
            return {"detail": "if there is an account associated with this email we will email a link for resetting your password."}

    except EmailNotValidError as e:
        # email is not valid, exception message is human-readable
        print(str(e))
        return {"detail": str(e)}


@router.get("/forgot_password_request_accept/{access_token}", response_class=RedirectResponse)
async def forgot_password_request_accept(access_token: str, db: Session = Depends(get_db)):

    try:
        user = await get_current_user_from_token(access_token=access_token, db=db)
        print("user ", user)
        if user:
            return RedirectResponse(f"{_os.getenv('FRONT_END_URL')}/NewPassword/{access_token}", status_code=status.HTTP_302_FOUND)
        else:
            raise AttributeError
    except AttributeError as e:
        return RedirectResponse(f"{_os.getenv('FRONT_END_URL')}/Error", status_code=status.HTTP_302_FOUND)

    # return {"email": returned_user.email,
    #         "username": returned_user.username,
    #         "is_active": returned_user.is_active,
    #         "result": "forgot password reset will complete after you set up a new password from the reactjs front end form"
    #         }


@router.post("/password_update")
async def update_email(
    req: Request,
    user: PasswordUpdate,
    db: Session = Depends(get_db)
):
    try:

        returned_user = await get_current_user_from_token(req.headers['access_token'], db=db)

        if user.password != user.passwordConfirm:
            return {"result": "password and password confirmation boxes do not match."}

        if len(user.password) > 0 and len(user.password) < 8 or len(user.password) > 50:
            return {"result": "password must be at least 8 characters and at most 50 charactrers long."}

        hashed_security_answer_that_is_coming_from_front_end = Hasher.verify_secret_question(user.answer, returned_user.security_answer)

        if hashed_security_answer_that_is_coming_from_front_end:
            stmt = (update(User).where(User.email == returned_user.email).values(hashed_password=Hasher.get_hash(user.password)))
            db.execute(stmt)
            db.commit()
            return None
        else:
            return {"result": "security question's answer is incorrect."}

    except AttributeError as e:
        print(str(e))
        return None


@router.post("/user_create", response_model=UserResponse)
async def post_user_create(data: UserCreate, db: Session = Depends(get_db)):

    if data.password != data.password_confirm:
        return {"result": "password and password confirmation boxes do not match."}

    else:

        user = {
            "username": data.username,
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email,
            "password": data.password,
            "security_answer": data.security_answer,
            "security_name": data.security_name,
        }

        try:
            returned_user_or_error = await create_new_user(user=user, db=db)
            # print(returned_user_or_error.email)
            # print(returned_user_or_error.id)
            access_token = create_acess_token_and_create_limit_table_entry(user=returned_user_or_error.email, db=db, id=returned_user_or_error.id)
            return {"username": returned_user_or_error.username,
                    "access_token": access_token,
                    "result": "Signing up completed. Please, click on a link."}
        except AttributeError as e:
            print(e)
            return {"result": "email or username is present errror on server"}


@router.patch("/update_user", response_model=UserResponse)
async def patch_user(
    req: Request,
    data: UserUpdate,
    db: Session = Depends(get_db)
):

    current_user_or_access_token_error = await get_current_user_from_token(access_token=req.headers['access_token'], db=db)

    if current_user_or_access_token_error.username != data.username:
        user = db.query(User).filter(User.username == data.username).one_or_none()
        if user:
            return {"result": "selected username is in use by some other member please choose another username."}

    if data.password != data.password_confirm:
        return {"result": "password and password confirmation boxes do not match."}

    if len(data.password) > 0 and len(data.password) < 8 or len(data.password) > 50:
        return {"result": "password must be at least 8 characters and at most 50 charactrers long."}

    if len(data.username) > 0 and len(data.username) < 3 or len(data.username) > 50:
        return {"result": "username must be at least 3 characters and at most 50 charactrers long."}

    if current_user_or_access_token_error.security_name != data.security_name and data.security_answer == "":
        return {"result": "Since you changed your security question, you must provide an answer for the new security question."}

    else:
        user = {
            "email": data.email,
            "password": data.password,
            "username": data.username,
            "security_answer": data.security_answer,
            "security_name": data.security_name,
        }

        try:
            returned_user_or_error, EMAIL_CHANGED = await update_user(
                user=user,
                current_email=current_user_or_access_token_error.email,
                username=current_user_or_access_token_error.username,
                user_id=current_user_or_access_token_error.id,
                db=db
            )

            print("EMAIL_CHANGED ", EMAIL_CHANGED)
            if (EMAIL_CHANGED):
                return {
                    "username": returned_user_or_error,
                    "EMAIL_CHANGED": EMAIL_CHANGED,
                    "result": "Email changed while profile updating. Please, confirm email change by following the link that is sent your email address."
                }
            else:
                return {
                    "username": returned_user_or_error,
                    "EMAIL_CHANGED": EMAIL_CHANGED,
                    "result": "Profile updating completed. Please, click on a link."
                }
        except AttributeError as e:
            print(e)
            return {"result": "email or username is present errror on server"}


@router.get("/update_email/{access_token}", response_class=RedirectResponse)
async def update_email(
    access_token: str,
    db: Session = Depends(get_db)
):

    user_id, email = await get_current_user_from_token_with_user_id(access_token, db=db)

    print("current_user_or_access_token_error.email ", email)

    try:
        await update_email_address(
            proposed_email=email,
            user_id=user_id,
            db=db
        )
        return RedirectResponse(f"{_os.getenv('FRONT_END_URL')}/Login", status_code=status.HTTP_302_FOUND)
    except AttributeError as e:
        return RedirectResponse(f"{_os.getenv('FRONT_END_URL')}/Error", status_code=status.HTTP_302_FOUND)


@router.get("/security_questions")
async def security_questions():
    return {
        "BORN_CITY": SecurityEnum.BORN_CITY,
        "FAVORITE_PET": SecurityEnum.FAVORITE_PET,
        "MOTHER_MAIDEN_NAME": SecurityEnum.MOTHER_MAIDEN_NAME,
        "GRADUATED_HIGH_SCHOOL_NAME": SecurityEnum.GRADUATED_HIGH_SCHOOL_NAME,
        "FIRST_CAR": SecurityEnum.FIRST_CAR,
        "FAVORITE_FOOD": SecurityEnum.FAVORITE_FOOD,
    }


@router.get("/security_question")
async def security_question(req: Request, db: Session = Depends(get_db)):
    returned_user = await get_current_user_from_token(access_token=req.headers['access_token'], db=db)
    return {"email": returned_user.email, "security_name": returned_user.security_name, "username": returned_user.username}


@router.get("/logout")
async def logout(req: Request, db: Session = Depends(get_db)):
    await logout_user(access_token=req.headers['access_token'], db=db)
