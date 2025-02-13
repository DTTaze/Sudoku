import os
from dotenv import load_dotenv
from fastapi import Depends
from sqlalchemy import create_engine, Column, Integer, String,JSON
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from pathlib import Path
from typing import Annotated

# Tải biến môi trường từ .env
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

# Lấy URL kết nối database từ file .env
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
print("Database URL:", SQLALCHEMY_DATABASE_URL)
# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://sudoku:sudoku123@localhost:3306/sudoku_database"
# Tạo engine kết nối tới cơ sở dữ liệu
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Khởi tạo SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tạo base class cho tất cả các model
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    google_sub = Column(String(50), unique=True, nullable=True)  # Google `sub` thường có 21-30 ký tự, đặt dư một chút
    email = Column(String(255), unique=True)  # Email có thể khá dài, 255 là tiêu chuẩn chung
    username = Column(String(50), unique=True)  # Tùy theo yêu cầu, 50 là một lựa chọn phổ biến
    match = Column(String(81), nullable=True)  # Đã có sẵn, giữ nguyên
    complete_match = Column(String(81), nullable=True)  # Đã có sẵn, giữ nguyên
    completed_matches_count = Column(JSON, default={})  # Kiểu JSON không cần giới hạn độ dài

# Hàm tạo session cơ sở dữ liệu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Định nghĩa db_dependency để dùng trong FastAPI
db_dependency = Annotated[Session, Depends(get_db)]

# Tạo các bảng trong cơ sở dữ liệu nếu chưa tồn tại
Base.metadata.create_all(engine)
