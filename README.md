# Course Management System (CMS)

## Mô tả
CMS là hệ thống quản lý khóa học trực tuyến hỗ trợ quản lý khóa học, bài giảng, đăng ký học, làm quiz, chấm điểm và theo dõi tiến độ học tập. Hệ thống có các vai trò chính: quản trị viên, giảng viên/mentor và sinh viên.

## Công nghệ
- Backend: Java 21, Spring Boot 3
- Database: MongoDB
- Frontend: React
- API: RESTful API
- Xác thực và phân quyền: Spring Security, JWT
- Cloud: AWS

## Chức năng chính

### 1. Xác thực và tài khoản
- Đăng ký tài khoản
- Đăng nhập bằng username hoặc email
- Quên mật khẩu, đặt lại mật khẩu, xác minh email
- Lưu token JWT và tự động đăng xuất khi token không hợp lệ
- Cập nhật hồ sơ cá nhân

### 2. Quản lý người dùng
- Quản trị viên xem, tạo, cập nhật, xóa người dùng
- Phân quyền người dùng theo role
- Kích hoạt hoặc vô hiệu hóa tài khoản
- Lọc người dùng theo vai trò

### 3. Quản lý khóa học
- Xem danh sách khóa học công khai
- Lọc khóa học miễn phí, trả phí, theo danh mục
- Xem chi tiết khóa học
- Tạo, cập nhật, công bố, hủy công bố và xóa khóa học
- Theo dõi số lượng đăng ký, đánh giá và bài học

### 4. Quản lý bài giảng
- Xem danh sách bài giảng theo khóa học
- Xem chi tiết bài giảng
- Tạo, cập nhật, công bố, hủy công bố và xóa bài giảng
- Sắp xếp bài giảng theo thứ tự trong khóa học

### 5. Đăng ký học và thanh toán
- Sinh viên đăng ký khóa học
- Theo dõi các khóa học đã đăng ký
- Hỗ trợ khóa học FREE và PREMIUM
- Khởi tạo và hoàn tất thanh toán cho khóa học trả phí
- Cập nhật trạng thái đăng ký và tiến độ học

### 6. Quiz và bài kiểm tra
- Tạo quiz cho từng bài học
- Thêm câu hỏi trắc nghiệm, đáp án và giải thích
- Sinh viên làm quiz và nộp bài
- Tính điểm tự động, xác định đạt hoặc không đạt
- Xem lịch sử và chi tiết các lần làm bài

### 7. Theo dõi tiến độ học tập
- Ghi nhận bắt đầu xem bài học
- Cập nhật thời lượng đã xem
- Đánh dấu hoàn thành bài học
- Xem tiến độ theo bài học, khóa học và người dùng hiện tại

### 8. Quản lý điểm và báo cáo
- Chấm điểm theo khóa học
- Xem điểm của sinh viên theo khóa học
- Dashboard riêng cho admin, mentor và student

### 9. Chat real-time
- Chat hỗ trợ trực tuyến giữa người dùng và admin
- Chat theo ngữ cảnh khóa học hoặc hỗ trợ chung
- Gửi tin nhắn real-time bằng WebSocket/STOMP qua SockJS
- Có REST fallback khi WebSocket chưa sẵn sàng
- Hiển thị hộp chat nổi trên giao diện cho người dùng đã đăng nhập

### 10. Chức năng học tập trên frontend
- Trang chủ, giới thiệu, liên hệ
- Trang đăng nhập, đăng ký, hồ sơ
- Trang khóa học, chi tiết khóa học, học bài
- Trang tiến độ học, chứng chỉ, wishlist, điểm số
- Khu vực quản trị cho admin

## Vai trò sử dụng
- ADMIN: quản lý toàn bộ hệ thống, người dùng, khóa học, báo cáo
- MENTOR: tạo và quản lý khóa học, bài giảng, quiz, theo dõi học viên
- STUDENT: xem khóa học, đăng ký, học bài, làm quiz, theo dõi tiến độ
- PUBLIC: xem các khóa học công khai trước khi đăng nhập
- Tất cả người dùng đã đăng nhập có thể dùng chat hỗ trợ real-time

## Kiến trúc
Hệ thống backend được tổ chức theo mô hình tách lớp:

- controller
- service
- repository
- model
- dto
- config
- exception
- security

## Cấu trúc thư mục
```text
backend/
  src/main/java/com/cms/
    config/
    controller/
    dto/
    exception/
    model/
    repository/
    service/
    security/
  src/main/resources/
    application.yml
  docs/
    requirements.md
    erd.md
  pom.xml

frontend/
  src/
    components/
    layouts/
    pages/
    routes/
    services/
    styles/
```

## Cách chạy backend
1. Cài đặt và khởi động MongoDB.
2. Mở file `backend/src/main/resources/application.yml`.
3. Kiểm tra cấu hình URI MongoDB.
4. Chạy các lệnh sau:

```bash
mvn clean install
mvn spring-boot:run
```

Backend chạy tại: http://localhost:8080

## Cách chạy frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: http://localhost:5173

## Quy ước đặt tên
- Entity: PascalCase
- Method/variable: camelCase
- Collection/field: rõ nghĩa, thường dùng chữ thường hoặc camelCase theo convention của project
- API endpoint: lowercase, rõ nghĩa

## Tài liệu
- docs/requirements.md
- docs/erd.md
- backend/API_DOCUMENTATION.md

