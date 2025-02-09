# Sử dụng Python 3.13
FROM python:3.13

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt Poetry
RUN pip install --upgrade pip && pip install poetry --upgrade

# Sao chép tệp cấu hình Poetry từ thư mục gốc vào container
COPY pyproject.toml poetry.lock ./

# Cài đặt dependencies
RUN poetry install --no-root

# Sao chép mã nguồn vào container
COPY . .

# Đảm bảo `uvicorn` được cài đặt
RUN poetry run pip install uvicorn

# Chạy ứng dụng FastAPI với Uvicorn
CMD ["poetry", "run", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
