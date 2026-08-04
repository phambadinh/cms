# CMS Backend - Course Management System

## Kiến Trúc Hệ Thống

Hệ thống quản lý khóa học trực tuyến được xây dựng theo mô hình Udemy với hỗ trợ khóa học miễn phí (FREE) và khóa học trả phí (PREMIUM).

### Công Nghệ Sử Dụng
- **Java 21** + **Spring Boot 3.2.0**
- **MongoDB** - Cơ sở dữ liệu NoSQL
- **Spring Security** - Xác thực và phân quyền
- **JWT** - Token-based authentication
- **CORS** - Hỗ trợ kết nối từ frontend

## Các Vai Trò Trong Hệ Thống

### 1. **ADMIN** (Quản trị viên)
- Quản lý toàn bộ hệ thống
- Phân quyền người dùng
- Xem báo cáo thống kê

### 2. **MENTOR** (Giảng viên)
- Tạo và quản lý khóa học
- Tạo bài học (video + nội dung)
- Tạo bài kiểm tra trắc nghiệm
- Xem tiến độ học của sinh viên
- Chấm điểm bài làm

### 3. **STUDENT** (Học sinh)
- Xem danh sách khóa học
- Đăng ký khóa học
- Xem video bài học
- Làm bài kiểm tra trắc nghiệm
- Theo dõi tiến độ học tập

## Cấu Trúc Dữ Liệu

### Users (Người Dùng)
```json
{
  "id": "string",
  "username": "string",
  "password": "string (encrypted)",
  "email": "string",
  "fullName": "string",
  "role": "ADMIN | MENTOR | STUDENT",
  "profileImage": "string (URL)",
  "bio": "string",
  "active": "boolean",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### Courses (Khóa Học)
```json
{
  "id": "string",
  "code": "string",
  "name": "string",
  "description": "string",
  "instructorId": "string",
  "courseType": "FREE | PREMIUM",
  "price": "Double (null for FREE)",
  "category": "string",
  "thumbnail": "string (URL)",
  "level": "BEGINNER | INTERMEDIATE | ADVANCED",
  "totalLessons": "Integer",
  "rating": "Double",
  "enrollmentCount": "Integer",
  "published": "boolean",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### Lessons (Bài Học)
```json
{
  "id": "string",
  "courseId": "string",
  "title": "string",
  "description": "string",
  "videoUrl": "string",
  "duration": "Integer (seconds)",
  "orderNumber": "Integer",
  "published": "boolean",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### Enrollments (Đăng Ký Khóa Học)
```json
{
  "id": "string",
  "userId": "string",
  "courseId": "string",
  "status": "ACTIVE | COMPLETED | INACTIVE",
  "progressPercentage": "Double",
  "paymentStatus": "PENDING | COMPLETED | REFUNDED",
  "enrolledAt": "LocalDateTime",
  "completedAt": "LocalDateTime"
}
```

### Quizzes (Bài Kiểm Tra)
```json
{
  "id": "string",
  "lessonId": "string",
  "courseId": "string",
  "title": "string",
  "description": "string",
  "passingScore": "Integer (default: 70)",
  "questionIds": ["string"],
  "published": "boolean",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### Questions (Câu Hỏi)
```json
{
  "id": "string",
  "quizId": "string",
  "questionText": "string",
  "options": ["string"],
  "correctAnswerIndex": "Integer",
  "orderNumber": "Integer",
  "explanation": "string",
  "createdAt": "LocalDateTime"
}
```

### QuizAttempts (Lần Làm Bài Kiểm Tra)
```json
{
  "id": "string",
  "quizId": "string",
  "userId": "string",
  "courseId": "string",
  "score": "Integer",
  "totalQuestions": "Integer",
  "selectedAnswers": ["Integer"],
  "passed": "boolean",
  "attemptedAt": "LocalDateTime",
  "durationSeconds": "Long"
}
```

### LessonProgress (Tiến Độ Bài Học)
```json
{
  "id": "string",
  "userId": "string",
  "lessonId": "string",
  "courseId": "string",
  "completed": "boolean",
  "watchedDuration": "Double (seconds)",
  "startedAt": "LocalDateTime",
  "completedAt": "LocalDateTime"
}
```

## API Endpoints

### Authentication (Xác Thực)

#### Đăng Ký
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "STUDENT"
}

Response (201):
{
  "id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "STUDENT",
  ...
}
```

#### Đăng Nhập
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "STUDENT"
}
```

### Courses (Khóa Học)

#### Xem Khóa Học Đã Công Bố
```
GET /api/courses/public
Response: [CourseResponse]
```

#### Xem Khóa Học Miễn Phí
```
GET /api/courses/public/free
Response: [CourseResponse]
```

#### Xem Khóa Học Trả Phí
```
GET /api/courses/public/premium
Response: [CourseResponse]
```

#### Xem Chi Tiết Khóa Học
```
GET /api/courses/{courseId}
Response: CourseResponse
```

#### Tạo Khóa Học (MENTOR/ADMIN)
```
POST /api/courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "JAVA101",
  "name": "Java Programming",
  "description": "Learn Java from basics",
  "courseType": "FREE|PREMIUM",
  "price": 99.99,
  "category": "Programming",
  "level": "BEGINNER"
}

Response: CourseResponse
```

#### Cập Nhật Khóa Học (MENTOR/ADMIN)
```
PUT /api/courses/{courseId}
Authorization: Bearer {token}
Content-Type: application/json

{...CourseRequest...}

Response: CourseResponse
```

#### Công Bố Khóa Học (MENTOR/ADMIN)
```
POST /api/courses/{courseId}/publish
Authorization: Bearer {token}
Response: 200 OK
```

### Lessons (Bài Học)

#### Xem Bài Học Của Khóa Học
```
GET /api/lessons/course/{courseId}
Response: [LessonResponse]
```

#### Xem Chi Tiết Bài Học
```
GET /api/lessons/{lessonId}
Authorization: Bearer {token}
Response: LessonResponse
```

#### Tạo Bài Học (MENTOR/ADMIN)
```
POST /api/lessons/course/{courseId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Lesson 1: Introduction",
  "description": "Introduction to Java",
  "videoUrl": "https://...",
  "duration": 600,
  "orderNumber": 1
}

Response: LessonResponse
```

### Enrollments (Đăng Ký Khóa Học)

#### Đăng Ký Khóa Học (STUDENT)
```
POST /api/enrollments
Authorization: Bearer {token}
Content-Type: application/json

{
  "courseId": "course_id"
}

Response: EnrollmentResponse
```

#### Xem Các Khóa Học Đã Đăng Ký (STUDENT)
```
GET /api/enrollments/my-enrollments
Authorization: Bearer {token}
Response: [EnrollmentResponse]
```

#### Xem Chi Tiết Đăng Ký (STUDENT)
```
GET /api/enrollments/course/{courseId}
Authorization: Bearer {token}
Response: EnrollmentResponse
```

#### Xem Danh Sách Học Sinh (MENTOR/ADMIN)
```
GET /api/enrollments/course/{courseId}/students
Authorization: Bearer {token}
Response: [EnrollmentResponse]
```

#### Cập Nhật Tiến Độ (STUDENT)
```
PUT /api/enrollments/{enrollmentId}/progress?progressPercentage=50.0
Authorization: Bearer {token}
Response: EnrollmentResponse
```

### Quizzes (Bài Kiểm Tra)

#### Tạo Quiz (MENTOR/ADMIN)
```
POST /api/quizzes
Authorization: Bearer {token}
Content-Type: application/json

{
  "lessonId": "lesson_id",
  "courseId": "course_id",
  "title": "Quiz 1",
  "description": "Knowledge Check",
  "passingScore": 70
}

Response: QuizResponse
```

#### Thêm Câu Hỏi (MENTOR/ADMIN)
```
POST /api/quizzes/{quizId}/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "questionText": "What is Java?",
  "options": ["A. Programming Language", "B. Coffee", "C. Island"],
  "correctAnswerIndex": 0,
  "orderNumber": 1,
  "explanation": "Java is a programming language..."
}

Response: QuestionResponse
```

#### Lấy Quiz Để Làm (STUDENT)
```
GET /api/quizzes/lesson/{lessonId}
Authorization: Bearer {token}
Response: QuizResponse
```

#### Nộp Bài Kiểm Tra (STUDENT)
```
POST /api/quiz-attempts/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "quizId": "quiz_id",
  "selectedAnswers": [0, 1, 0],
  "durationSeconds": 300
}

Response: QuizAttemptResponse
{
  "score": 2,
  "totalQuestions": 3,
  "passed": true,
  "scorePercentage": 66.67
}
```

### Lesson Progress (Tiến Độ Bài Học)

#### Bắt Đầu Xem Bài Học (STUDENT)
```
POST /api/lesson-progress/{lessonId}/start?courseId=course_id
Authorization: Bearer {token}
Response: LessonProgress
```

#### Cập Nhật Tiến Độ Xem (STUDENT)
```
PUT /api/lesson-progress/{lessonId}/update?watchedDuration=300
Authorization: Bearer {token}
Response: LessonProgress
```

#### Hoàn Thành Bài Học (STUDENT)
```
POST /api/lesson-progress/{lessonId}/complete
Authorization: Bearer {token}
Response: LessonProgress
```

## Quy Trình Học Tập

### 1. Đăng Ký Tài Khoản
```
POST /api/auth/register
- Tạo tài khoản với vai trò STUDENT
```

### 2. Duyệt Danh Sách Khóa Học
```
GET /api/courses/public
GET /api/courses/public/free
GET /api/courses/public/premium
```

### 3. Đăng Ký Khóa Học
```
POST /api/enrollments
- Nếu khóa học FREE: tự động đăng ký
- Nếu khóa học PREMIUM: chờ thanh toán (chưa implement)
```

### 4. Xem Bài Học
```
GET /api/lessons/course/{courseId}
- Lấy danh sách bài học
GET /api/lessons/{lessonId}
- Xem chi tiết bài học kèm video
POST /api/lesson-progress/{lessonId}/start
- Ghi nhận bắt đầu xem bài
```

### 5. Làm Bài Kiểm Tra
```
GET /api/quizzes/lesson/{lessonId}
- Lấy quiz (không hiển thị đáp án đúng)
POST /api/quiz-attempts/submit
- Nộp bài trả lời
```

### 6. Theo Dõi Tiến Độ
```
GET /api/enrollments/my-enrollments
- Xem tất cả khóa học đã đăng ký
GET /api/enrollments/course/{courseId}
- Xem tiến độ của khóa học cụ thể
```

## Phân Quyền (Authorization)

### Public Endpoints (Không cần token)
- `GET /api/courses/public*`
- `GET /api/courses/{courseId}`
- `GET /api/lessons/course/{courseId}`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Student Only
- `POST /api/enrollments`
- `GET /api/enrollments/my-enrollments`
- `GET /api/lesson-progress/**`
- `POST /api/quiz-attempts/submit`

### Mentor/Admin Only
- `POST /api/courses`
- `PUT /api/courses/{courseId}`
- `POST /api/courses/{courseId}/publish`
- `POST /api/lessons/course/{courseId}`
- `POST /api/quizzes`
- `POST /api/quizzes/{quizId}/questions`

## Chạy Ứng Dụng

### Yêu Cầu
- Java 21+
- MongoDB running on `mongodb://localhost:27017`

### Build & Run
```bash
# Compile
mvn clean compile

# Run tests
mvn test

# Package
mvn package

# Run
java -jar target/course-management-system-1.0.0.jar
```

### Cấu Hình
Chỉnh sửa `src/main/resources/application.yml`:
```yaml
server:
  port: 8080

spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/cms_db
```

## Ví Dụ Quy Trình Hoàn Chỉnh

### 1. Mentor Tạo Khóa Học
```bash
# Đăng nhập
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"mentor1","password":"pass123"}'

# Tạo khóa học
curl -X POST http://localhost:8080/api/courses \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code":"JAVA101",
    "name":"Java Programming",
    "courseType":"FREE",
    "level":"BEGINNER"
  }'
```

### 2. Mentor Thêm Bài Học
```bash
curl -X POST http://localhost:8080/api/lessons/course/{courseId} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Lesson 1",
    "videoUrl":"https://...",
    "duration":600,
    "orderNumber":1
  }'
```

### 3. Mentor Tạo Quiz
```bash
curl -X POST http://localhost:8080/api/quizzes \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId":"{lessonId}",
    "courseId":"{courseId}",
    "title":"Quiz 1",
    "passingScore":70
  }'
```

### 4. Student Đăng Ký Khóa Học
```bash
curl -X POST http://localhost:8080/api/enrollments \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"{courseId}"}'
```

### 5. Student Làm Bài Kiểm Tra
```bash
curl -X POST http://localhost:8080/api/quiz-attempts/submit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "quizId":"{quizId}",
    "selectedAnswers":[0,1,0],
    "durationSeconds":300
  }'
```
