Yêu cầu hệ thống Course Management System (CMS)

## 1. Phạm vi hệ thống
Hệ thống quản lý khóa học trực tuyến hỗ trợ:
- Quản lý khóa học
- Quản lý sinh viên
- Quản lý giảng viên
- Quản lý bài giảng
- Chấm điểm
- Theo dõi tiến độ học tập

## 2. Chức năng chính
### 2.1. Quản lý khóa học
- Thêm mới khóa học
- Cập nhật thông tin khóa học
- Xóa khóa học
- Tìm kiếm và lọc khóa học theo tên, danh mục, giảng viên
- Xem danh sách sinh viên đã đăng ký

### 2.2. Quản lý sinh viên
- Thêm/sửa/xóa thông tin sinh viên
- Tìm kiếm sinh viên
- Xem danh sách khóa học đang học
- Xem kết quả và tiến độ học tập

### 2.3. Quản lý giảng viên
- Thêm/sửa/xóa giảng viên
- Phân công giảng viên cho khóa học
- Xem danh sách khóa học đang phụ trách

### 2.4. Quản lý bài giảng
- Tạo bài giảng cho từng khóa học
- Upload tài liệu học tập
- Sắp xếp bài giảng theo chương hoặc buổi học
- Cập nhật trạng thái hoàn thành

### 2.5. Quản lý điểm và tiến độ
- Nhập điểm thành phần
- Tính điểm tổng kết
- Hiển thị tiến độ hoàn thành khóa học
- Xem báo cáo kết quả học tập theo sinh viên hoặc khóa học

### 2.6. Xác thực và phân quyền
- Đăng nhập
- Đăng ký
- Phân quyền admin/teacher/student

## 3. Entity chính
- `User`
- `Student`
- `Teacher`
- `Course`
- `Lecture`
- `Enrollment`
- `Grade`
- `Progress`

## 4. Chức năng không trong phạm vi hiện tại
- Thi online tự động
- Thanh toán học phí
- Tích hợp video conference
- Chat trực tuyến
- Upload và xem video bài giảng

## 5. Quy ước đặt tên
### 5.1. Class / Entity
- Dùng `PascalCase`
- Ví dụ: `User`, `Student`, `Course`, `CourseController`

### 5.2. Method / Variable
- Dùng `camelCase`
- Ví dụ: `getCourseById`, `userName`, `courseList`

### 5.3. Database table / collection / field
- Dùng `snake_case`
- Ví dụ: `users`, `student_info`, `course_id`

### 5.4. API endpoint
- Dùng dạng rõ nghĩa, lowercase
- Endpoint của bạn nằm ngay trong đoạn code controller: base path là `@RequestMapping("/api/auth")`, rồi ghép thêm từng `@PostMapping` hoặc `@GetMapping` bên dưới để ra URL đầy đủ. Vì vậy backend của bạn không phải mở ở domain gốc, mà phải mở các đường dẫn như `/api/auth/login`, `/api/auth/register`...

### 5.5. Thư mục
```
backend/
  src/main/java/com/cms/
    controller/
    service/
    repository/
    model/
    dto/
    config/
    exception/
    security/
  src/main/resources/
    application.yml
  docs/
    requirements.md
    erd.md