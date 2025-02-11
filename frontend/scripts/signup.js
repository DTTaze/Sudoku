// Gọi API từ backend để lấy API_URL
fetch("http://localhost:8000/config")
  .then(response => response.json())  // Chuyển kết quả về JSON
  .then(config => {
    // Gán URL động từ backend vào sự kiện click
    document.getElementById("SignUpGoogle").onclick = function () {
      window.location.href = `${config.API_URL}/auth/google`;
    };
  })
  .catch(error => console.error("Lỗi khi lấy API_URL:", error));
