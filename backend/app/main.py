from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import User

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Hoặc ["http://localhost"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(User.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}