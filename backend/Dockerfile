# Sử dụng Python 3.10 làm base image
FROM python:3.10

# Đặt thư mục làm việc
WORKDIR /app

# Cài đặt Poetry
RUN pip install poetry

# Copy file cấu hình Poetry trước để cache dependency
COPY pyproject.toml poetry.lock ./

# Cài đặt dependencies bằng Poetry
RUN poetry config virtualenvs.create false && poetry install --no-root --no-dev

# Copy toàn bộ mã nguồn backend vào container
COPY backend/ .  

# Mở cổng 8000 cho FastAPI
EXPOSE 8000

# Chạy ứng dụng FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
