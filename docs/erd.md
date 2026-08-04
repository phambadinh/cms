ERD Sơ bộ - Course Management System

## Danh sách entity và thuộc tính

### 1. User
- `id` (PK)
- `username`
- `password`
- `email`
- `role`

### 2. Student
- `id` (PK)
- `userId` (FK)
- `fullName`
- `phone`
- `address`
- `dateOfBirth`

### 3. Teacher
- `id` (PK)
- `userId` (FK)
- `fullName`
- `phone`
- `email`
- `specialization`

### 4. Course
- `id` (PK)
- `title`
- `description`
- `teacherId` (FK)
- `category`
- `createdAt`
- `updatedAt`

### 5. Lecture
- `id` (PK)
- `courseId` (FK)
- `title`
- `content`
- `materialUrl`
- `order`
- `isCompleted`

### 6. Enrollment
- `id` (PK)
- `studentId` (FK)
- `courseId` (FK)
- `enrolledAt`
- `status`

### 7. Grade
- `id` (PK)
- `enrollmentId` (FK)
- `lectureId` (FK)
- `score`
- `maxScore`
- `comment`

### 8. Progress
- `id` (PK)
- `enrollmentId` (FK)
- `lectureId` (FK)
- `isCompleted`
- `completedAt`

## Quan hệ
- `Teacher` 1-n `Course`
- `Course` 1-n `Lecture`
- `Student` n-n `Course` thông qua `Enrollment`
- `Enrollment` 1-n `Grade`
- `Enrollment` 1-n `Progress`
