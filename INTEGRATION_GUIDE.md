 HƯỚNG DẪN CHẠY HỆ THỐNG CMS - TÍCH HỢP BACKEND & FRONTEND

## ✅ TRẠNG THÁI: TÍCH HỢP HOÀN THÀNH

Frontend và Backend đã được kết nối hoàn toàn với JWT Authentication và API calls.

---

## 📋 YÊU CẦU TRƯỚC KHI CHẠY

### Backend Requirements:
- ✅ Java 21
- ✅ Maven 3.8+
- ✅ MongoDB chạy trên `mongodb://localhost:27017`

### Frontend Requirements:
- ✅ Node.js 18+
- ✅ npm hoặc yarn

---

## 🚀 CÁC BƯỚC CHẠY HỆ THỐNG

### BƯỚC 1: Chạy MongoDB (nếu chưa chạy)

```bash
# Windows
mongod

# Linux/Mac
mongod --dbpath /path/to/data/directory
```

Hoặc nếu sử dụng Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

### BƯỚC 2: Chạy Backend (Java Spring Boot)

```bash
cd d:\CMS\backend

# Compile và run
mvn clean spring-boot:run

# Hoặc nếu đã compile
mvn spring-boot:run
```

✅ Backend sẽ chạy trên `http://localhost:8080`
✅ API endpoints: `http://localhost:8080/api/...`

**Kiểm tra backend đã chạy:**
```bash
curl http://localhost:8080/api/courses/public
```

---

### BƯỚC 3: Chạy Frontend (React + Vite)

Mở terminal mới:

```bash
cd d:\CMS\frontend

# Cài đặt dependencies (lần đầu)
npm install

# Chạy dev server
npm run dev
```

✅ Frontend sẽ chạy trên `http://localhost:5173`

---

## 🔑 CÁC TÀI KHOẢN TEST

### Tài khoản có sẵn (tạo trong database)

Bạn cần tạo các tài khoản này trên backend. Sử dụng API hoặc MongoDB thực trực tiếp:

#### Endpoint tạo tài khoản:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@cms.com",
    "password": "admin123",
    "fullName": "Admin User",
    "role": "ADMIN"
  }'
```

#### Tài khoản khuyên dùng để test:

| Username | Password | Role | Chức năng |
|----------|----------|------|----------|
| admin | admin123 | ADMIN | Quản lý hệ thống |
| mentor | mentor123 | MENTOR | Tạo khóa học, quản lý quiz |
| student | student123 | STUDENT | Học tập, làm quiz |

---

## 🔗 FLOW TÍCH HỢP

### 1. Đăng nhập
```
User nhập username/password
    ↓
Frontend gọi: POST /api/auth/login
    ↓
Backend xác thực, trả về JWT token
    ↓
Frontend lưu token + user info vào localStorage
    ↓
Chuyển hướng đến Dashboard/Courses tùy role
```

### 2. Lấy danh sách khóa học
```
User vào trang Courses
    ↓
Frontend gọi: GET /api/courses/public
(Tự động thêm Authorization: Bearer {token})
    ↓
Backend trả về danh sách khóa học
    ↓
Frontend hiển thị bảng khóa học
```

### 3. Ghi danh khóa học
```
User click "Ghi danh"
    ↓
Frontend gọi: POST /api/enrollments/{courseId}
    ↓
Backend tạo enrollment cho user
    ↓
User được chuyển hướng đến chi tiết khóa học
```

### 4. Xem bài giảng và làm quiz
```
User click vào khóa học
    ↓
Frontend gọi: GET /api/courses/{courseId}
           + GET /api/lessons/course/{courseId}
    ↓
Backend trả về chi tiết khóa học + danh sách bài giảng
    ↓
User chọn bài giảng → xem video
    ↓
Frontend gọi: GET /api/quizzes/lesson/{lessonId}
    ↓
User làm quiz → POST /api/quiz-attempts/{quizId}
    ↓
Backend tính điểm, trả về kết quả
```

---

## 📊 API ENDPOINTS ĐÃ TÍCH HỢP

### Authentication
- ✅ `POST /api/auth/login` - Đăng nhập
- ✅ `POST /api/auth/register` - Đăng ký
- ✅ `POST /api/auth/login-email` - Đăng nhập với email

### Courses
- ✅ `GET /api/courses/public` - Danh sách khóa học công bố
- ✅ `GET /api/courses/{courseId}` - Chi tiết khóa học
- ✅ `POST /api/courses` - Tạo khóa học (MENTOR)
- ✅ `POST /api/courses/{courseId}/publish` - Công bố

### Lessons
- ✅ `GET /api/lessons/course/{courseId}` - Danh sách bài giảng
- ✅ `POST /api/lessons/course/{courseId}` - Tạo bài giảng (MENTOR)

### Enrollments
- ✅ `POST /api/enrollments/{courseId}` - Ghi danh khóa học
- ✅ `GET /api/enrollments/my-enrollments` - Khóa học đã ghi danh

### Quizzes
- ✅ `GET /api/quizzes/lesson/{lessonId}` - Quiz của bài giảng
- ✅ `POST /api/quiz-attempts/{quizId}` - Nộp bài quiz

### Dashboard
- ✅ `GET /api/enrollments/my-enrollments` - Lấy số khóa học ghi danh
- ✅ `GET /api/quiz-attempts/my-attempts` - Lấy số quiz đã làm

---

## 🔧 TROUBLESHOOTING

### Frontend không kết nối được Backend

**Vấn đề:** Lỗi CORS, API request fail
**Giải pháp:**
1. Kiểm tra backend đã chạy: `http://localhost:8080/api/courses/public`
2. Kiểm tra file `.env` trong frontend: `VITE_API_URL=http://localhost:8080/api`
3. Xóa cache localStorage: `localStorage.clear()`

### Login thất bại

**Vấn đề:** "Sai username hoặc password"
**Giải pháp:**
1. Kiểm tra tài khoản đã tạo trong MongoDB
2. Xem logs backend để tìm lỗi
3. Dùng API test: `curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'`

### Token hết hạn

**Vấn đề:** Bị logout tự động sau 24 giờ
**Giải pháp:**
- Frontend sẽ tự động chuyển hướng về Login
- User cần đăng nhập lại

---

## 📝 NOTES

- JWT Token có thời hạn 24 giờ (86400000 ms)
- Tất cả authenticated requests tự động thêm header: `Authorization: Bearer {token}`
- CORS đã được cấu hình cho port 5173
- MongoDB collections: users, courses, lessons, enrollments, quizzes, questions, quiz_attempts, lesson_progress

---

## 🎓 TIẾP THEO

**Frontend cần phát triển thêm:**
- ✅ Integrated login/courses/quiz pages
- ⏳ Students management page
- ⏳ Teachers management page
- ⏳ Grades management page
- ⏳ Progress tracking page
- ⏳ Lecture management (MENTOR)

Tất cả API đã sẵn sàng, chỉ cần gọi và hiển thị dữ liệu!

---

**Created:** 2026-06-10
**Status:** ✅ Integration Complete
