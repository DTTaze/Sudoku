from datetime import timedelta, datetime, UTC
import os
from jose import jwt, JWTError
import json

from ...app.db.database import db_dependency
from ...app.routers.auth.validators import GoogleUser
from ...app.db.database import User

ALGORITHM = "HS256"

def get_or_create_user_by_google_sub(google_user : GoogleUser, db : db_dependency):

    existing_user = db.query(User).filter(User.email == google_user.email).first()

    if existing_user:
        return existing_user
    else :
        new_User = User(
            google_sub = google_user.sub,
            email = google_user.email,
            username = google_user.name,
            match = "",
            complete_match = "",
            completed_matches_count=json.dumps({})  
        )
        db.add(new_User)
        db.commit
        db.refresh(new_User)
        return new_User


def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {"sub": username, "id": user_id}

    expires = datetime.now(UTC) + expires_delta

    encode.update({"exp": expires})

    return jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm=ALGORITHM)

def create_refresh_token(username: str, user_id: int, expires_delta: timedelta):
    return create_access_token(username, user_id, expires_delta)