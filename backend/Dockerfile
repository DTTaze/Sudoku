# Sử dụng Python 3.13
FROM python:3.13

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép tệp cấu hình Poetry vào container trước để tối ưu cache
COPY pyproject.toml poetry.lock ./

# Cài đặt Poetry
RUN pip install --upgrade pip && pip install poetry --upgrade

# Cài đặt dependencies, bao gồm cả package chính
RUN poetry install --no-root 

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Sao chép file .env để load biến môi trường
COPY ../.env .env

# Đảm bảo `uvicorn` được cài đặt
RUN poetry run pip install uvicorn

# Mở cổng 8000
EXPOSE 8000

# Chạy ứng dụng FastAPI với Uvicorn
CMD ["poetry", "run", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
