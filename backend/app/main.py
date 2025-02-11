from fastapi import FastAPI
from backend.app.routers.auth.google_auth import router,init_oauth
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from starlette.middleware.sessions import SessionMiddleware
from .routers import User
from pathlib import Path
from dotenv import load_dotenv
import os

app = FastAPI()

app.include_router(router)

init_oauth(app)

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH, override=True)

GOOGLE_DOMAIN = os.getenv("GOOGLE_DOMAIN")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Hoặc ["http://localhost"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

secret_key = os.getenv('SECRET_KEY')
app.add_middleware(SessionMiddleware, secret_key) 

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to FastAPI!"}

@app.get("/")
async def home():
    
    return HTMLResponse(f"""
    <a href="{GOOGLE_DOMAIN}/auth/google">Login with Google</a>
    """)
