from authlib.integrations.starlette_client import OAuth
from authlib.oauth2.rfc6749 import OAuth2Token
from authlib.integrations.base_client import OAuthError
from datetime import timedelta
from fastapi import Request, HTTPException, APIRouter
from fastapi.responses import HTMLResponse
from .validators import GoogleUser
from ...db.database import db_dependency
from ...Services.auth import get_or_create_user_by_google_sub, create_access_token,create_refresh_token
from starlette import status
from pathlib import Path
from dotenv import load_dotenv
import os


# Xác định thư mục backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH, override=True)

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

oauth = OAuth()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL")

def init_oauth(app):
    oauth.register(
        name='google',
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={
            "scope": "openid email profile"
        }
    )


@router.get("/google")
async def login_google(request: Request):
    print(GOOGLE_REDIRECT_URI)
    return await oauth.google.authorize_redirect(request, GOOGLE_REDIRECT_URI)

@router.get("/callback")
async def auth(request: Request, db =  db_dependency):
    try:
        user_response: OAuth2Token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        print("OAuthError:", str(e))  # In ra lỗi cụ thể
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    user_info = user_response.get("userinfo")

    google_user = GoogleUser(**user_info)

    user = get_or_create_user_by_google_sub(google_user, db)

    access_token = create_access_token(user.username, user.id, timedelta(days=7))
    refresh_token = create_refresh_token(user.username, user.id, timedelta(days=14))

    # Tạo response
    response = RedirectResponse(FRONTEND_URL)
    
    # Lưu token vào cookie (HttpOnly giúp bảo mật hơn)
    response.set_cookie(key="access_token", value=access_token, httponly=True, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, path="/")

    return response
    if user_info:
        # get infor from user 
        user_info_display = f"""
        <h1>Thông tin người dùng</h1>
        <p><strong>Tên:</strong> {user_info.get('name', 'Không có thông tin')}</p>
        <p><strong>Email:</strong> {user_info.get('email', 'Không có thông tin')}</p>
        <p><strong>Tên riêng:</strong> {user_info.get('given_name', 'Không có thông tin')}</p>
        <p><strong>Họ:</strong> {user_info.get('family_name', 'Không có thông tin')}</p>
        <p><strong>Hình đại diện:</strong> <img src="{user_info.get('picture', '')}" alt="Profile Picture" width="100"></p>
        <p><strong>Ngôn ngữ:</strong> {user_info.get('locale', 'Không có thông tin')}</p>
        <p><strong>ID người dùng:</strong> {user_info.get('sub', 'Không có thông tin')}</p>
        """
        return HTMLResponse(user_info_display)
    
    raise HTTPException(status_code=400, detail="Authentication failed")

