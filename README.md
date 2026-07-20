Course Management System (CMS)
Mô tả
Hệ thống quản lý khóa học trực tuyến hỗ trợ quản lý sinh viên, giảng viên, bài giảng, chấm điểm và theo dõi tiến độ học tập.

Công nghệ
Backend: Java Spring Boot

Database: MongoDB

Frontend: React

API: RESTful API

Xác thực: Spring Security, JWT

Cloud: AWS

Kiến trúc
Hệ thống được xây dựng theo mô hình backend tách lớp:

controller

service

repository

model

dto

config

exception

security

Cấu trúc thư mục
text
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
Cách chạy backend
Cài MongoDB và chạy service.

Mở file src/main/resources/application.yml.

Kiểm tra URI MongoDB.

Chạy:

bash
mvn clean install
mvn spring-boot:run
Backend chạy tại http://localhost:8080

Quy ước đặt tên
Entity: PascalCase

Method/variable: camelCase

Collection/field: rõ nghĩa, thường dùng chữ thường hoặc camelCase theo MongoDB convention của project

API endpoint: lowercase, rõ nghĩa

Tài liệu
docs/requirements.md

docs/erd.md

