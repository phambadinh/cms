# Hướng dẫn import dữ liệu vào MongoDB Compass

## File dữ liệu
File `cms_seed.jsonl` chứa tất cả dữ liệu seed cho các collection của CMS.

## Cách 1: Import bằng MongoDB Compass (Recommended)

1. **Mở MongoDB Compass** và kết nối đến `mongodb://localhost:27017/cms_db`

2. **Import từng collection**:
   - **Users collection**: 
     - Tạo hoặc chọn collection `users` 
     - Click "Import Data" → chọn `cms_seed.jsonl`
     - Paste lọc JSON: `{"__collection__":"users"}`
     - Hoặc: Lọc các dòng có `"__collection__":"users"`

   - **Courses collection**:
     - Tạo collection `courses`
     - Lọc: `{"__collection__":"courses"}`

   - **Lessons collection**:
     - Tạo collection `lessons`
     - Lọc: `{"__collection__":"lessons"}`

   - **Enrollments collection**:
     - Tạo collection `enrollments`
     - Lọc: `{"__collection__":"enrollments"}`

   - **Grades collection**:
     - Tạo collection `grades`
     - Lọc: `{"__collection__":"grades"}`

   - **Quizzes collection**:
     - Tạo collection `quizzes`
     - Lọc: `{"__collection__":"quizzes"}`

   - **Questions collection**:
     - Tạo collection `questions`
     - Lọc: `{"__collection__":"questions"}`

   - **Quiz Attempts collection**:
     - Tạo collection `quiz_attempts`
     - Lọc: `{"__collection__":"quiz_attempts"}`

   - **Lesson Progress collection**:
     - Tạo collection `lesson_progress`
     - Lọc: `{"__collection__":"lesson_progress"}`

## Cách 2: Sử dụng mongoimport từ PowerShell

Chạy từ thư mục `backend/db/seed`:

```powershell
# Import users
mongoimport --db cms_db --collection users --file cms_seed.jsonl --query '{"__collection__":"users"}'

# Import courses
mongoimport --db cms_db --collection courses --file cms_seed.jsonl --query '{"__collection__":"courses"}'

# ... và tiếp tục cho các collection khác
```

## Cách 3: Tách file JSONL thành từng collection (Thủ công)

Nếu cần tách file `cms_seed.jsonl` thành riêng từng collection:

**PowerShell Script:**
```powershell
$content = Get-Content 'cms_seed.jsonl'
$content | ForEach-Object {
    $line = $_
    $json = $line | ConvertFrom-Json
    $collection = $json.__collection__
    $json.PSObject.Properties.Remove('__collection__')
    $json | ConvertTo-Json | Out-File -Append -FilePath "$collection.jsonl"
}
```

## Lưu ý

- **Password**: Các password trong user được mã hóa bằng BCrypt
  - Admin: `admin` / `admin123`
  - Mentor: `mentor` / `password`
  - Student: `student` / `password`

- **Database**: `cms_db` (cấu hình trong `backend/src/main/resources/application.yml`)

- **Trường `__collection__`**: Được thêm vào để dễ xác định collection, cần xóa khi import nếu DB không hỗ trợ

## Kiểm tra sau import

Sau khi import xong, chạy backend để kiểm tra kết nối:
```bash
cd backend
mvn spring-boot:run
```

Backend sẽ kết nối tới MongoDB tại `mongodb://localhost:27017/cms_db`
