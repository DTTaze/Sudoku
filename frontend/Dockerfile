# Sử dụng Nginx để phục vụ frontend
FROM nginx:latest
WORKDIR /usr/share/nginx/html

# Xóa file mặc định của Nginx
RUN rm -rf ./*

# Copy toàn bộ mã nguồn frontend vào container
COPY frontend/ .  

# Mở cổng 80 để truy cập web
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
