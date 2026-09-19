# BÁO CÁO THỰC TẬP TỐT NGHIỆP

## HỆ THỐNG QUẢN LÝ CÁC KHÓA HỌC LẬP TRÌNH

> **Hướng dẫn sử dụng tài liệu:** Nội dung dưới đây được biên soạn theo đúng bố cục mẫu trong ảnh: bìa, lời cam đoan, mục lục, danh mục hình ảnh, 5 chương và tài liệu tham khảo. Các dòng bắt đầu bằng `[Chèn ...]` là vị trí cần bổ sung ảnh chụp màn hình, sơ đồ hoặc thông tin cá nhân trước khi dàn trang Word. Khi chuyển sang Word, dùng Heading 1/2/3 để Word tự sinh mục lục và danh mục hình.

---

## TRANG BÌA

**TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI TP. HỒ CHÍ MINH**  
**BAN CÔNG NGHỆ SỐ**

_[Chèn logo UTH tại đây]_

### BÁO CÁO THỰC TẬP TỐT NGHIỆP

### HỆ THỐNG QUẢN LÝ CÁC KHÓA HỌC LẬP TRÌNH

| Người hướng dẫn | Sinh viên thực hiện |
|---|---|
| ThS. Bùi Văn Thương | Phạm Bá Định |
|  | MSSV: 15100001 |

**Chuyên ngành:** Công nghệ thông tin  
**Đơn vị:** Ban Công nghệ số  
**TP. Hồ Chí Minh, năm 2026**

---

## LỜI CAM ĐOAN

Em xin cam đoan báo cáo thực tập tốt nghiệp với đề tài **“Hệ thống quản lý các khóa học lập trình”** là kết quả nghiên cứu, phân tích, thiết kế và triển khai của cá nhân em dưới sự hướng dẫn của giảng viên hướng dẫn.

Các nội dung trình bày trong báo cáo được xây dựng dựa trên quá trình tìm hiểu yêu cầu, thiết kế phần mềm, lập trình, kiểm thử và đánh giá hệ thống. Những tài liệu, thư viện, nền tảng và nguồn tham khảo được sử dụng trong quá trình thực hiện đều được liệt kê tại phần **Tài liệu tham khảo**. Các số liệu kiểm thử, ảnh chụp giao diện và kết quả vận hành bổ sung vào bản in phải phản ánh đúng trạng thái thực tế của project.

Em xin chịu trách nhiệm về tính trung thực của nội dung báo cáo.

**TP. Hồ Chí Minh, ngày ..... tháng ..... năm 2026**  
**Sinh viên thực hiện**

**Phạm Bá Định**

---

## MỤC LỤC

1. **TỔNG QUAN / GIỚI THIỆU**
   1.1. Giới thiệu đề tài
   1.2. Khảo sát và phân tích các tài liệu liên quan đến vấn đề cần giải quyết
   1.3. Mục tiêu và phạm vi của đề tài
   1.4. Phương pháp thực hiện
2. **GIẢI PHÁP ĐỀ XUẤT**
   2.1. Cơ sở lý thuyết
   2.2. Lịch sử phát triển và khảo sát giải pháp
   2.3. Phương pháp / tiêu chí đánh giá
   2.4. Kết quả dự kiến của đề tài
3. **PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG**
   3.1. Phân tích chức năng
   3.2. Thiết kế hệ thống
   3.3. Thiết kế cơ sở dữ liệu
   3.4. Thiết kế giao diện và API
4. **KIỂM THỬ VÀ CÀI ĐẶT**
   4.1. Môi trường cài đặt
   4.2. Kịch bản kiểm thử
   4.3. Kết quả kiểm thử
   4.4. Hướng dẫn cài đặt và vận hành
5. **KẾT QUẢ, KẾT LUẬN / HƯỚNG PHÁT TRIỂN**
   5.1. Kết quả đạt được
   5.2. Ưu điểm và hạn chế
   5.3. Kết luận
   5.4. Hướng phát triển

---

## DANH MỤC HÌNH ẢNH

| Ký hiệu | Tên hình | Vị trí đề xuất |
|---|---|---|
| Hình 1.1 | Quy trình học trực tuyến của hệ thống | Chương 1, mục 1.1 |
| Hình 1.2 | Bối cảnh và vấn đề cần giải quyết | Chương 1, mục 1.2 |
| Hình 2.1 | Kiến trúc tổng quan của giải pháp | Chương 2, mục 2.1 |
| Hình 2.2 | Quy trình xác thực và phân quyền bằng JWT | Chương 2, mục 2.1 |
| Hình 3.1 | Sơ đồ phân rã chức năng | Chương 3, mục 3.1 |
| Hình 3.2 | Use case tổng quát | Chương 3, mục 3.1 |
| Hình 3.3 | Quy trình đăng ký và học khóa học | Chương 3, mục 3.1 |
| Hình 3.4 | Quy trình làm quiz và tính điểm | Chương 3, mục 3.1 |
| Hình 3.5 | Kiến trúc triển khai hệ thống | Chương 3, mục 3.2 |
| Hình 3.6 | Mô hình dữ liệu của hệ thống | Chương 3, mục 3.3 |
| Hình 3.7 | Màn hình đăng nhập | Chương 3, mục 3.4 |
| Hình 3.8 | Màn hình danh sách khóa học | Chương 3, mục 3.4 |
| Hình 3.9 | Màn hình học bài và theo dõi tiến độ | Chương 3, mục 3.4 |
| Hình 3.10 | Màn hình quản trị khóa học | Chương 3, mục 3.4 |
| Hình 3.11 | Màn hình quản lý quiz | Chương 3, mục 3.4 |
| Hình 3.12 | Màn hình chứng chỉ và xác minh | Chương 3, mục 3.4 |
| Hình 3.13 | Màn hình chat hỗ trợ | Chương 3, mục 3.4 |
| Hình 4.1 | Cấu trúc thư mục project | Chương 4, mục 4.1 |
| Hình 4.2 | Backend khởi động thành công | Chương 4, mục 4.4 |
| Hình 4.3 | Frontend khởi động thành công | Chương 4, mục 4.4 |
| Hình 5.1 | Quy trình nghiệp vụ hoàn chỉnh sau triển khai | Chương 5, mục 5.1 |

---

# CHƯƠNG 1. TỔNG QUAN / GIỚI THIỆU

## 1.1. Giới thiệu đề tài

### 1.1.1. Bối cảnh

Trong quá trình chuyển đổi số giáo dục, hình thức học trực tuyến giúp người học chủ động lựa chọn nội dung, thời gian và tốc độ học. Tuy nhiên, một hệ thống học trực tuyến không chỉ cần hiển thị danh sách khóa học. Hệ thống cần quản lý xuyên suốt nhiều nghiệp vụ: tài khoản, vai trò, khóa học, bài giảng, đăng ký học, kiểm tra, điểm số, tiến độ và chứng chỉ.

Đề tài xây dựng **Hệ thống quản lý các khóa học lập trình** nhằm cung cấp một nền tảng tập trung cho ba nhóm người dùng chính: quản trị viên, giảng viên và sinh viên. Hệ thống hỗ trợ công khai khóa học, quản trị nội dung, tổ chức việc học, đánh giá kết quả và trao đổi hỗ trợ trong quá trình học.

**[Hình 1.1. Quy trình học trực tuyến của hệ thống: chèn sơ đồ Đăng ký tài khoản → Duyệt khóa học → Ghi danh → Học bài → Làm quiz → Theo dõi tiến độ → Nhận chứng chỉ.]**

### 1.1.2. Lý do chọn đề tài

Các cách quản lý bằng bảng tính hoặc các kênh trao đổi rời rạc thường gây ra các vấn đề: dữ liệu người học khó đồng bộ, trạng thái khóa học không rõ ràng, giảng viên khó theo dõi tiến độ, kết quả kiểm tra phải xử lý thủ công và người học không có một nơi thống nhất để xem lịch sử học tập.

Vì vậy, đề tài được lựa chọn với các lý do sau:

- Chuẩn hóa quy trình quản lý khóa học và bài giảng.
- Phân tách rõ quyền hạn của quản trị viên, giảng viên và sinh viên.
- Tự động hóa chấm điểm bài kiểm tra trắc nghiệm.
- Theo dõi tiến độ học tập theo khóa học và bài học.
- Tạo nền tảng có thể mở rộng thêm thanh toán, chứng chỉ, blog và chat.
- Vận dụng kiến thức về phân tích thiết kế hệ thống, lập trình web, cơ sở dữ liệu và bảo mật.

### 1.1.3. Ý nghĩa của đề tài

Về mặt thực tiễn, hệ thống giúp giảm thao tác quản lý thủ công, hỗ trợ người học học tập có lộ trình và giúp giảng viên theo dõi được kết quả. Về mặt học tập, đề tài là một bài toán tích hợp nhiều thành phần trong một sản phẩm web hoàn chỉnh, từ giao diện người dùng đến API, cơ sở dữ liệu và phân quyền.

## 1.2. Khảo sát và phân tích các tài liệu liên quan đến vấn đề cần giải quyết

### 1.2.1. Hiện trạng bài toán

Qua khảo sát yêu cầu trong project, các nghiệp vụ cốt lõi được xác định gồm quản lý khóa học, sinh viên, giảng viên, bài giảng, điểm và tiến độ. Project ban đầu cũng xác định một số nội dung nằm ngoài phạm vi như thi trực tuyến tự động, thanh toán, hội nghị video, chat và upload video. Trong quá trình triển khai, một số nội dung đã được mở rộng thành chức năng thực tế như quiz, thanh toán, chat WebSocket, blog, wishlist và chứng chỉ.

Sự khác biệt này cần được ghi rõ trong báo cáo: phạm vi ban đầu là cơ sở để phân tích, còn phạm vi nghiệm thu là các module đã tồn tại trong mã nguồn và được kiểm thử thực tế.

**[Hình 1.2. Bối cảnh và vấn đề cần giải quyết: chèn ảnh minh họa việc dữ liệu khóa học, bài học, điểm và tiến độ được tập trung trong một hệ thống.]**

### 1.2.2. Khảo sát các nhóm người dùng

| Nhóm người dùng | Nhu cầu chính | Quyền chính trong hệ thống |
|---|---|---|
| Khách truy cập | Xem thông tin và khóa học đã công bố | Xem trang công khai, danh sách và chi tiết khóa học |
| Sinh viên | Đăng ký, học, làm bài và xem kết quả | Ghi danh, học bài, cập nhật tiến độ, làm quiz, xem điểm và chứng chỉ |
| Giảng viên | Xây dựng và theo dõi khóa học | Tạo khóa học, bài giảng, quiz, xem học viên, điểm và tiến độ |
| Quản trị viên | Quản lý toàn hệ thống | Quản lý người dùng, nội dung, đăng ký, điểm, chứng chỉ và báo cáo |

### 1.2.3. Các vấn đề cần giải quyết

1. Xác định danh tính người dùng và duy trì phiên đăng nhập an toàn.
2. Ngăn người dùng truy cập chức năng ngoài vai trò.
3. Quản lý quan hệ giữa khóa học, bài giảng, quiz, câu hỏi và kết quả.
4. Cập nhật tiến độ học mà không làm mất tính nhất quán dữ liệu.
5. Trả dữ liệu cho frontend theo cấu trúc rõ ràng, không phụ thuộc trực tiếp vào model cơ sở dữ liệu.
6. Hỗ trợ nhiều trạng thái nghiệp vụ như bản nháp, đã công bố, đang học, hoàn thành và thu hồi.
7. Tạo nền tảng có thể mở rộng mà vẫn giữ cấu trúc mã nguồn dễ bảo trì.

## 1.3. Mục tiêu và phạm vi của đề tài

### 1.3.1. Mục tiêu tổng quát

Phân tích, thiết kế và xây dựng một hệ thống web quản lý các khóa học lập trình, hỗ trợ đầy đủ quy trình từ tạo nội dung đến học tập, kiểm tra và đánh giá kết quả.

### 1.3.2. Mục tiêu cụ thể

- Xây dựng giao diện React có các khu vực riêng cho admin, mentor và student.
- Xây dựng REST API bằng Spring Boot 3 và Java 21.
- Lưu trữ dữ liệu bằng MongoDB theo mô hình document.
- Áp dụng Spring Security và JWT cho xác thực, mã hóa mật khẩu và phân quyền.
- Quản lý khóa học FREE/PREMIUM, bài giảng, quiz và câu hỏi trắc nghiệm.
- Tự động tính điểm, xác định đạt hoặc không đạt và lưu lịch sử làm bài.
- Theo dõi thời lượng xem, trạng thái hoàn thành và phần trăm tiến độ.
- Hỗ trợ quản lý điểm, thanh toán, chứng chỉ, wishlist, blog và chat hỗ trợ.

### 1.3.3. Phạm vi chức năng

| Phạm vi | Nội dung |
|---|---|
| Xác thực | Đăng ký, đăng nhập username/email, xác minh email, quên và đặt lại mật khẩu |
| Người dùng | Hồ sơ, vai trò, kích hoạt/vô hiệu hóa, phân quyền |
| Khóa học | CRUD, lọc, công khai/hủy công khai, khóa miễn phí và trả phí |
| Bài giảng | CRUD, thứ tự, video URL, thời lượng, công khai/hủy công khai |
| Học tập | Ghi danh, học bài, cập nhật tiến độ, hoàn thành khóa học |
| Đánh giá | Quiz, câu hỏi, nộp bài, điểm, lịch sử lần làm |
| Hỗ trợ | Điểm, chứng chỉ, wishlist, blog, chat real-time |

### 1.3.4. Giới hạn của đề tài

- Nội dung video được lưu bằng URL; project chưa phải là hệ thống lưu trữ và phân phối video riêng.
- Thanh toán cần phụ thuộc cấu hình môi trường và cổng thanh toán; bản local cần kiểm thử theo cấu hình thực tế.
- Chat real-time cần backend WebSocket và frontend kết nối đúng endpoint `/ws`.
- Số liệu thống kê hiển thị trên giao diện phải được phân biệt giữa dữ liệu demo và dữ liệu phát sinh từ cơ sở dữ liệu.
- Repository hiện chưa thể hiện đầy đủ bộ kiểm thử tự động JUnit/React; vì vậy cần bổ sung bằng kiểm thử thủ công có minh chứng và test tự động trong giai đoạn nâng cấp.

## 1.4. Phương pháp thực hiện

Đề tài sử dụng quy trình lặp gồm các bước: khảo sát yêu cầu, phân tích nghiệp vụ, thiết kế dữ liệu và API, triển khai backend/frontend, tích hợp, kiểm thử và đánh giá. Mỗi module được phát triển theo hướng tách lớp để dễ kiểm tra và mở rộng.

Các phương pháp được sử dụng:

- **Phân tích hướng chức năng:** xác định tác nhân, đầu vào, xử lý và đầu ra.
- **Thiết kế hướng dịch vụ:** controller tiếp nhận request, service xử lý nghiệp vụ, repository truy cập MongoDB.
- **Phát triển giao diện theo component:** tái sử dụng layout, sidebar, card, bảng quản trị và các component học tập.
- **Kiểm thử theo kịch bản:** kiểm tra luồng đúng, dữ liệu không hợp lệ, phân quyền và trạng thái lỗi.
- **Đánh giá theo tiêu chí:** tính đúng chức năng, bảo mật, khả năng sử dụng, hiệu năng cảm nhận và khả năng bảo trì.

---

# CHƯƠNG 2. GIẢI PHÁP ĐỀ XUẤT

## 2.1. Cơ sở lý thuyết

### 2.1.1. Ứng dụng web client-server

Hệ thống được tổ chức theo mô hình client-server. Frontend chịu trách nhiệm hiển thị giao diện và tương tác với người dùng. Backend cung cấp API, xử lý nghiệp vụ và xác thực. MongoDB lưu trữ dữ liệu nghiệp vụ. Cách tổ chức này cho phép thay đổi giao diện mà không làm thay đổi toàn bộ nghiệp vụ ở máy chủ.

### 2.1.2. React và kiến trúc component

React được sử dụng để xây dựng giao diện theo các component độc lập. Những thành phần như Header, Sidebar, Layout, CourseCard, VideoPlayer, QuizQuestion và AdminCrudPage được tổ chức để tái sử dụng. React Router quản lý điều hướng; các route nhạy cảm được bọc bởi ProtectedRoute, RoleRoute và EnrollmentRoute.

### 2.1.3. Spring Boot và REST API

Spring Boot giúp xây dựng ứng dụng Java với cấu hình tập trung, dependency injection và các starter cho web, MongoDB, security, validation, mail và websocket. REST API sử dụng các phương thức HTTP phù hợp: GET để truy vấn, POST để tạo hoặc thực hiện hành động, PUT để cập nhật và DELETE để xóa.

### 2.1.4. MongoDB

MongoDB là cơ sở dữ liệu NoSQL dạng document. Dữ liệu được lưu theo các collection như `users`, `courses`, `lessons`, `enrollments`, `grades`, `quizzes`, `questions`, `quiz_attempts`, `lesson_progress` và các collection mở rộng. Mô hình này phù hợp với dữ liệu có cấu trúc thay đổi, đặc biệt là câu hỏi quiz và thông tin mở rộng của khóa học.

### 2.1.5. JWT và phân quyền theo vai trò

Sau khi đăng nhập thành công, backend phát hành JWT chứa thông tin định danh và vai trò. Frontend lưu token, tự động gắn token vào header `Authorization: Bearer <token>` cho các request cần xác thực. Backend giải mã và kiểm tra chữ ký, thời hạn trước khi đưa thông tin người dùng vào SecurityContext.

**[Hình 2.1. Kiến trúc tổng quan của giải pháp: chèn sơ đồ Frontend React ↔ REST/WebSocket ↔ Spring Boot ↔ MongoDB.]**

**[Hình 2.2. Quy trình xác thực và phân quyền bằng JWT: chèn sơ đồ Login → phát hành token → gửi Bearer token → JwtAuthFilter → kiểm tra role → xử lý request.]**

## 2.2. Lịch sử phát triển và khảo sát giải pháp

### 2.2.1. Giải pháp quản lý thủ công

Bảng tính phù hợp với quy mô nhỏ nhưng khó đảm bảo phân quyền, khó đồng bộ khi nhiều người cập nhật, không có luồng học tập và không tự động tính toán trạng thái hoàn thành.

### 2.2.2. Nền tảng học trực tuyến có sẵn

Các nền tảng có sẵn cung cấp nhiều chức năng nhưng thường khó tùy chỉnh theo quy trình riêng, khó kiểm soát kiến trúc và không phù hợp mục tiêu thực hành phân tích, thiết kế và triển khai hệ thống.

### 2.2.3. Giải pháp được lựa chọn

Project lựa chọn xây dựng hệ thống riêng bằng React, Spring Boot và MongoDB. Đây là lựa chọn cân bằng giữa khả năng phát triển nhanh, tính phổ biến, khả năng mở rộng và mục tiêu học tập. Kiến trúc tách frontend/backend giúp API có thể phục vụ nhiều loại client trong tương lai.

## 2.3. Phương pháp / tiêu chí đánh giá

| Nhóm tiêu chí | Nội dung đánh giá |
|---|---|
| Chức năng | Chức năng chính hoạt động đúng với vai trò và dữ liệu hợp lệ |
| Bảo mật | Token, mật khẩu, route và API được bảo vệ theo vai trò |
| Dữ liệu | Dữ liệu liên kết đúng, trạng thái và điểm được cập nhật nhất quán |
| Giao diện | Có trạng thái tải, rỗng, lỗi; hiển thị rõ trên các vai trò |
| Khả năng sử dụng | Quy trình đăng nhập, ghi danh, học và làm quiz dễ thực hiện |
| Khả năng bảo trì | Tách lớp backend, component hóa frontend, DTO và API rõ ràng |
| Mở rộng | Có thể thêm loại khóa học, phương thức thanh toán và báo cáo |

## 2.4. Kết quả dự kiến của đề tài

Kết quả dự kiến là một sản phẩm web có thể chạy cục bộ với MongoDB, backend tại cổng 8080 và frontend tại cổng 5173. Người dùng có thể đăng ký, đăng nhập, xem khóa học, ghi danh, học bài, làm quiz và xem tiến độ. Mentor và admin có thể quản trị nội dung theo quyền.

Kết quả mở rộng gồm thanh toán, chứng chỉ, wishlist, blog và chat. Các chức năng này cần được kiểm chứng bằng dữ liệu thật trước khi đưa vào phần kết quả cuối cùng của bản in.

---

# CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

## 3.1. Phân tích chức năng

### 3.1.1. Sơ đồ phân rã chức năng

Hệ thống được phân rã thành các nhóm chức năng:

1. Quản lý xác thực và tài khoản.
2. Quản lý người dùng và vai trò.
3. Quản lý khóa học và bài giảng.
4. Quản lý ghi danh và thanh toán.
5. Quản lý quiz, câu hỏi và lần làm bài.
6. Quản lý điểm và tiến độ.
7. Quản lý chứng chỉ, wishlist và blog.
8. Quản lý chat và dashboard thống kê.

**[Hình 3.1. Sơ đồ phân rã chức năng: chèn sơ đồ phân cấp 8 nhóm chức năng nêu trên.]**

### 3.1.2. Tác nhân và use case

**Khách truy cập:** xem trang chủ, giới thiệu, blog, danh sách khóa học và chi tiết khóa học; đăng ký hoặc đăng nhập.

**Sinh viên:** quản lý hồ sơ, ghi danh, thanh toán, học bài, cập nhật tiến độ, làm quiz, xem điểm, nhận chứng chỉ, quản lý wishlist và chat hỗ trợ.

**Giảng viên:** tạo và chỉnh sửa khóa học, bài giảng, quiz, câu hỏi; công bố nội dung; theo dõi học viên, điểm và tiến độ.

**Quản trị viên:** quản lý toàn bộ người dùng, khóa học, bài giảng, quiz, ghi danh, điểm, tiến độ, chứng chỉ, blog và dashboard.

**[Hình 3.2. Use case tổng quát: chèn biểu đồ 4 tác nhân liên kết với các nhóm chức năng.]**

### 3.1.3. Quy trình đăng ký và học khóa học

1. Người dùng truy cập danh sách khóa học công khai.
2. Người dùng mở chi tiết khóa học và chọn ghi danh.
3. Với khóa FREE, hệ thống tạo enrollment và cho phép học.
4. Với khóa PREMIUM, hệ thống tạo hoặc tiếp tục quy trình thanh toán theo cấu hình.
5. Sinh viên mở bài học, hệ thống ghi nhận thời gian bắt đầu.
6. Khi xem bài, frontend gửi thời lượng đã xem để backend cập nhật.
7. Khi hoàn thành, hệ thống đánh dấu bài học và tính lại tiến độ khóa học.
8. Khi đạt điều kiện hoàn thành, sinh viên có thể yêu cầu hoặc được cấp chứng chỉ theo quyền.

**[Hình 3.3. Quy trình đăng ký và học khóa học: chèn lưu đồ từ duyệt khóa học đến hoàn thành.]**

### 3.1.4. Quy trình làm quiz và tính điểm

1. Mentor hoặc admin tạo quiz gắn với bài học và khóa học.
2. Người quản lý thêm câu hỏi, các lựa chọn, đáp án đúng và giải thích.
3. Sinh viên nhận danh sách câu hỏi dành cho student, không làm lộ đáp án đúng.
4. Sinh viên gửi danh sách lựa chọn và thời gian làm bài.
5. Backend sắp xếp câu hỏi theo `orderNumber`, so sánh đáp án và tính số câu đúng.
6. Điểm phần trăm được tính theo số câu đúng trên tổng số câu.
7. Hệ thống xác định đạt nếu điểm đạt ngưỡng `passingScore`.
8. Lần làm bài được lưu để sinh viên và người quản lý xem lịch sử.

**[Hình 3.4. Quy trình làm quiz và tính điểm: chèn lưu đồ tạo quiz → làm bài → nộp → chấm → lưu kết quả.]**

### 3.1.5. Đặc tả một số use case tiêu biểu

#### Use case UC-01: Đăng nhập

| Thành phần | Mô tả |
|---|---|
| Tác nhân | Khách truy cập |
| Tiền điều kiện | Tài khoản tồn tại và đang hoạt động |
| Luồng chính | Nhập username/email và mật khẩu; backend kiểm tra; phát hành JWT; frontend lưu thông tin; điều hướng theo vai trò |
| Ngoại lệ | Sai thông tin, tài khoản bị khóa, lỗi máy chủ |
| Hậu điều kiện | Người dùng có phiên xác thực hợp lệ |

#### Use case UC-02: Tạo khóa học

| Thành phần | Mô tả |
|---|---|
| Tác nhân | MENTOR hoặc ADMIN |
| Tiền điều kiện | Đã đăng nhập và có quyền tạo khóa học |
| Luồng chính | Nhập mã, tên, mô tả, loại, giá, danh mục, ảnh, cấp độ; gửi request; backend kiểm tra và lưu; khóa học ở trạng thái bản nháp |
| Ngoại lệ | Thiếu dữ liệu, giá không hợp lệ, không đủ quyền |
| Hậu điều kiện | Khóa học được lưu và có thể được công bố |

#### Use case UC-03: Cập nhật tiến độ

| Thành phần | Mô tả |
|---|---|
| Tác nhân | STUDENT |
| Tiền điều kiện | Sinh viên đã ghi danh khóa học |
| Luồng chính | Bắt đầu bài; cập nhật thời lượng; đánh dấu hoàn thành; backend cập nhật LessonProgress và Enrollment |
| Ngoại lệ | Không có ghi danh, bài học không tồn tại, token hết hạn |
| Hậu điều kiện | Tiến độ bài học và khóa học phản ánh trạng thái mới |

## 3.2. Thiết kế hệ thống

### 3.2.1. Kiến trúc backend

Backend sử dụng kiến trúc nhiều lớp:

- **Controller:** nhận request, kiểm tra quyền, trả response.
- **DTO:** định nghĩa dữ liệu request/response, tránh trả trực tiếp entity.
- **Service:** xử lý nghiệp vụ như tính điểm, cập nhật tiến độ, cấp chứng chỉ.
- **Repository:** truy vấn MongoDB.
- **Model:** biểu diễn document và enum trạng thái.
- **Security:** JWT, filter và cấu hình Spring Security.
- **Config:** CORS, WebSocket và tác vụ bất đồng bộ.
- **Exception:** xử lý lỗi thống nhất.

**[Hình 3.5. Kiến trúc triển khai hệ thống: chèn sơ đồ browser → React/Vite → REST API/WebSocket → Spring Boot → MongoDB/SMTP/cổng thanh toán.]**

### 3.2.2. Kiến trúc frontend

Frontend được chia thành các lớp và nhóm chức năng:

- `pages`: các trang cấp cao như Home, Login, Courses, CourseDetail, PaymentPage.
- `components/admin`: dashboard và CRUD dành cho admin.
- `components/mentor`: khóa học, bài giảng, điểm và tiến độ dành cho mentor.
- `components/student`: dashboard, học tập, quiz, chứng chỉ và wishlist.
- `layouts`: AppLayout và AdminLayout.
- `routes`: ProtectedRoute, RoleRoute, EnrollmentRoute và AppRoutes.
- `services`: api.js, authApi.js, blogApi.js, chatApi.js và chatSocket.js.
- `styles`: CSS theo từng màn hình và nhóm chức năng.

### 3.2.3. Kiểm soát truy cập

Backend dùng `@PreAuthorize` và kiểm tra role tại controller/service. Frontend dùng `ProtectedRoute` để chặn người chưa đăng nhập, `RoleRoute` để giới hạn khu vực theo vai trò và `EnrollmentRoute` để giới hạn khu vực học cho sinh viên đã ghi danh.

## 3.3. Thiết kế cơ sở dữ liệu

### 3.3.1. Các collection chính

| Collection | Vai trò |
|---|---|
| `users` | Tài khoản, vai trò, thông tin hồ sơ và trạng thái |
| `courses` | Thông tin khóa học, loại, giá, giảng viên và trạng thái công bố |
| `lessons` | Bài giảng, video URL, thứ tự, thời lượng và trạng thái |
| `enrollments` | Quan hệ người học - khóa học, trạng thái và phần trăm tiến độ |
| `grades` | Điểm của người học theo khóa học |
| `quizzes` | Bài kiểm tra gắn với bài học |
| `questions` | Câu hỏi và các lựa chọn của quiz |
| `quiz_attempts` | Lịch sử nộp bài, điểm và kết quả đạt |
| `lesson_progress` | Thời lượng xem và trạng thái hoàn thành bài |
| `certificates` | Chứng chỉ, trạng thái xác minh và thu hồi |
| `chat_messages` | Hội thoại hỗ trợ |
| `blog_posts` | Nội dung blog công khai và quản trị |
| `wishlists` | Khóa học yêu thích của sinh viên |

### 3.3.2. Quan hệ dữ liệu

Một khóa học có nhiều bài giảng, một bài giảng có thể có quiz, một quiz có nhiều câu hỏi. Sinh viên và khóa học có quan hệ nhiều-nhiều thông qua enrollment. Enrollment liên kết với tiến độ bài học, điểm và lịch sử quiz. Các liên kết được lưu bằng ID để phù hợp với MongoDB document.

**[Hình 3.6. Mô hình dữ liệu của hệ thống: chèn ERD cập nhật theo các model thực tế User, Course, Lesson, Enrollment, Grade, Quiz, Question, QuizAttempt, LessonProgress, Certificate, ChatMessage, BlogPost và Wishlist.]**

### 3.3.3. Quy tắc nghiệp vụ quan trọng

- Mật khẩu không lưu dạng rõ, được mã hóa bằng BCrypt.
- Khóa học FREE có giá bằng 0; khóa PREMIUM cần giá hợp lệ.
- Chỉ nội dung đã công bố mới xuất hiện ở danh sách công khai.
- Quiz được chấm theo câu hỏi đã sắp xếp, không phụ thuộc thứ tự truyền lên tùy ý.
- Enrollment đạt 100% thì có thể chuyển sang trạng thái hoàn thành.
- Chứng chỉ chỉ được cấp theo điều kiện hoàn thành và quyền của người cấp.
- Token hết hạn hoặc không hợp lệ phải làm sạch phiên ở frontend và đưa người dùng về trang đăng nhập.

## 3.4. Thiết kế giao diện và API

### 3.4.1. Các màn hình chính

**[Hình 3.7. Màn hình đăng nhập: chèn ảnh chụp Login.jsx với trạng thái nhập liệu và thông báo lỗi.]**

**[Hình 3.8. Màn hình danh sách khóa học: chèn ảnh chụp Courses.jsx với lọc FREE/PREMIUM, danh mục và thẻ khóa học.]**

**[Hình 3.9. Màn hình học bài và theo dõi tiến độ: chèn ảnh chụp LearningCourse.jsx gồm video, danh sách bài, thanh tiến độ và nút hoàn thành.]**

**[Hình 3.10. Màn hình quản trị khóa học: chèn ảnh chụp AdminCoursesPage.jsx gồm bảng, tạo/sửa/xóa, công bố và hủy công bố.]**

**[Hình 3.11. Màn hình quản lý quiz: chèn ảnh chụp QuizManagementPage.jsx gồm quiz, câu hỏi, đáp án và trạng thái.]**

**[Hình 3.12. Màn hình chứng chỉ và xác minh: chèn ảnh chụp trang Certificate và trang HTML viewable/verify.]**

**[Hình 3.13. Màn hình chat hỗ trợ: chèn ảnh chụp ChatWidget/ChatThread với hội thoại REST và WebSocket.]**

### 3.4.2. Một số API tiêu biểu

| Nhóm | Phương thức và endpoint | Mục đích |
|---|---|---|
| Auth | `POST /api/auth/register` | Đăng ký tài khoản |
| Auth | `POST /api/auth/login` | Đăng nhập và nhận JWT |
| Course | `GET /api/courses/public` | Lấy khóa học đã công bố |
| Course | `POST /api/courses` | Tạo khóa học cho mentor/admin |
| Lesson | `GET /api/lessons/course/{courseId}` | Lấy bài học theo khóa |
| Enrollment | `POST /api/enrollments` | Ghi danh khóa học |
| Progress | `POST /api/lesson-progress/{lessonId}/start` | Bắt đầu học bài |
| Quiz | `GET /api/quizzes/lesson/{lessonId}` | Lấy quiz của bài học |
| Quiz | `POST /api/quiz-attempts/submit` | Nộp và chấm bài |
| Grade | `GET /api/grades/my-grades` | Xem điểm của sinh viên |
| Certificate | `POST /api/certificates/issue` | Cấp chứng chỉ |
| Chat | `POST /api/chat/send` | Gửi tin nhắn dự phòng REST |

---

# CHƯƠNG 4. KIỂM THỬ VÀ CÀI ĐẶT

## 4.1. Môi trường cài đặt

| Thành phần | Phiên bản / cấu hình |
|---|---|
| Hệ điều hành | Windows |
| Ngôn ngữ backend | Java 21 |
| Framework backend | Spring Boot 3.2.0 |
| Build backend | Maven |
| Cơ sở dữ liệu | MongoDB, database `cms_db` |
| Frontend | React 18, Vite 5 |
| Trình duyệt kiểm thử | Chrome hoặc Edge phiên bản hiện hành |
| Backend URL | `http://localhost:8080` |
| Frontend URL | `http://localhost:5173` |

**[Hình 4.1. Cấu trúc thư mục project: chèn ảnh Explorer/VS Code hiển thị backend, frontend, docs và các file cấu hình.]**

## 4.2. Kịch bản kiểm thử

### 4.2.1. Kiểm thử xác thực và phân quyền

| Mã | Kịch bản | Kết quả mong đợi | Kết quả thực tế |
|---|---|---|---|
| AUTH-01 | Đăng ký dữ liệu hợp lệ | Tạo tài khoản thành công | [Điền sau khi chạy] |
| AUTH-02 | Đăng nhập đúng mật khẩu | Nhận JWT và điều hướng theo role | [Điền sau khi chạy] |
| AUTH-03 | Đăng nhập sai mật khẩu | Trả lỗi, không tạo phiên | [Điền sau khi chạy] |
| AUTH-04 | Truy cập route khi chưa đăng nhập | Chuyển về `/login` | [Điền sau khi chạy] |
| AUTH-05 | Student truy cập trang admin | Bị từ chối | [Điền sau khi chạy] |
| AUTH-06 | Token hết hạn | Xóa phiên và chuyển về login | [Điền sau khi chạy] |

### 4.2.2. Kiểm thử khóa học và bài giảng

| Mã | Kịch bản | Kết quả mong đợi | Kết quả thực tế |
|---|---|---|---|
| COURSE-01 | Xem khóa học công khai | Chỉ hiển thị khóa học đã công bố | [Điền sau khi chạy] |
| COURSE-02 | Lọc khóa FREE/PREMIUM | Danh sách lọc đúng loại | [Điền sau khi chạy] |
| COURSE-03 | Mentor tạo khóa học | Khóa học được lưu ở trạng thái bản nháp | [Điền sau khi chạy] |
| COURSE-04 | Publish/unpublish khóa học | Trạng thái thay đổi và ảnh hưởng danh sách public | [Điền sau khi chạy] |
| COURSE-05 | Tạo bài học sai courseId | Backend trả lỗi phù hợp | [Điền sau khi chạy] |
| COURSE-06 | Student xem khóa học | Nhìn thấy thông tin và bài học được phép | [Điền sau khi chạy] |

### 4.2.3. Kiểm thử ghi danh, tiến độ và quiz

| Mã | Kịch bản | Kết quả mong đợi | Kết quả thực tế |
|---|---|---|---|
| LEARN-01 | Student ghi danh khóa FREE | Tạo enrollment ACTIVE | [Điền sau khi chạy] |
| LEARN-02 | Student mở bài học | Tạo LessonProgress hoặc trả bản ghi hiện có | [Điền sau khi chạy] |
| LEARN-03 | Cập nhật thời lượng xem | `watchedDuration` được cập nhật | [Điền sau khi chạy] |
| LEARN-04 | Hoàn thành tất cả bài | Tiến độ đạt 100%, enrollment COMPLETED | [Điền sau khi chạy] |
| QUIZ-01 | Làm quiz đúng toàn bộ | Điểm tối đa và passed=true | [Điền sau khi chạy] |
| QUIZ-02 | Làm quiz dưới ngưỡng | passed=false | [Điền sau khi chạy] |
| QUIZ-03 | Xem quiz dành cho student | Không lộ đáp án đúng | [Điền sau khi chạy] |
| QUIZ-04 | Xem lịch sử làm bài | Hiển thị đúng score, passed, thời gian | [Điền sau khi chạy] |

### 4.2.4. Kiểm thử chức năng mở rộng

| Mã | Kịch bản | Kết quả mong đợi | Kết quả thực tế |
|---|---|---|---|
| EXT-01 | Tạo và xem chứng chỉ | Chứng chỉ có mã và trạng thái xác minh | [Điền sau khi chạy] |
| EXT-02 | Thu hồi chứng chỉ | Chứng chỉ chuyển trạng thái revoked | [Điền sau khi chạy] |
| EXT-03 | Thêm/xóa wishlist | Danh sách yêu thích thay đổi đúng | [Điền sau khi chạy] |
| EXT-04 | Gửi chat REST | Tin nhắn lưu và hiển thị | [Điền sau khi chạy] |
| EXT-05 | Gửi chat WebSocket | Tin nhắn cập nhật theo thời gian thực | [Điền sau khi chạy] |
| EXT-06 | Khởi tạo thanh toán | Trả thông tin thanh toán hoặc lỗi cấu hình rõ ràng | [Điền sau khi chạy] |

## 4.3. Kết quả kiểm thử

Khi hoàn thiện bản báo cáo in, thay cột **Kết quả thực tế** bằng `Đạt` hoặc `Không đạt`, kèm ảnh minh chứng cho các ca quan trọng. Nên ưu tiên ảnh cho các luồng có giá trị chứng minh cao: đăng nhập, phân quyền, tạo khóa học, ghi danh, học bài, nộp quiz, cập nhật tiến độ và cấp chứng chỉ.

**[Bảng 4.1. Tổng hợp kết quả kiểm thử: bổ sung số ca đạt, không đạt và tỷ lệ đạt sau khi chạy.]**

| Nhóm kiểm thử | Tổng số ca | Đạt | Không đạt | Tỷ lệ đạt |
|---|---:|---:|---:|---:|
| Xác thực và phân quyền | 6 | [ ] | [ ] | [ ] |
| Khóa học và bài giảng | 6 | [ ] | [ ] | [ ] |
| Ghi danh, tiến độ và quiz | 8 | [ ] | [ ] | [ ] |
| Chức năng mở rộng | 6 | [ ] | [ ] | [ ] |
| **Tổng cộng** | **26** | **[ ]** | **[ ]** | **[ ]** |

**[Hình 4.2. Backend khởi động thành công: chèn ảnh terminal có dòng `Tomcat started on port 8080` và `Started Application`.]**

**[Hình 4.3. Frontend khởi động thành công: chèn ảnh terminal `npm run dev` và URL `http://localhost:5173`.]**

## 4.4. Hướng dẫn cài đặt và vận hành

### 4.4.1. Cài đặt MongoDB

1. Cài MongoDB và khởi động dịch vụ.
2. Đảm bảo database `cms_db` có thể truy cập tại `mongodb://localhost:27017`.
3. Có thể dùng dữ liệu mẫu trong thư mục `backups` để phục vụ kiểm thử, nhưng cần ghi rõ dữ liệu nào là dữ liệu mẫu.

### 4.4.2. Chạy backend

```bash
cd d:\CMS\backend
mvn clean install
mvn spring-boot:run
```

Backend sử dụng cổng 8080. Các biến môi trường quan trọng gồm `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRATION`, `FRONTEND_URL`, `MAIL_USERNAME`, `MAIL_PASSWORD` và `PAYMENT_RETURN_URL`.

### 4.4.3. Chạy frontend

```bash
cd d:\CMS\frontend
npm install
npm run dev
```

Frontend sử dụng `VITE_API_URL`, mặc định là `http://localhost:8080/api`.

### 4.4.4. Quy trình kiểm tra nhanh sau khi cài đặt

1. Mở frontend và kiểm tra trang chủ.
2. Đăng ký hoặc sử dụng tài khoản đã có.
3. Đăng nhập và kiểm tra điều hướng theo vai trò.
4. Kiểm tra danh sách khóa học công khai.
5. Với student, ghi danh một khóa FREE và mở trang học.
6. Làm quiz, kiểm tra điểm và lịch sử.
7. Với mentor/admin, tạo nội dung và kiểm tra trạng thái công bố.
8. Kiểm tra console trình duyệt và log backend nếu có lỗi.

---

# CHƯƠNG 5. KẾT QUẢ, KẾT LUẬN / HƯỚNG PHÁT TRIỂN

## 5.1. Kết quả đạt được

### 5.1.1. Về backend

Backend đã được tổ chức theo mô hình controller-service-repository, sử dụng DTO để trao đổi dữ liệu và MongoDB để lưu trữ. Các module xác thực, người dùng, khóa học, bài giảng, ghi danh, quiz, câu hỏi, lần làm bài, tiến độ, điểm, chứng chỉ, blog, wishlist, thanh toán và chat đã có controller/service tương ứng trong project.

Hệ thống áp dụng Spring Security, JWT, BCrypt và kiểm tra quyền theo vai trò. API được thiết kế theo nhóm tài nguyên, có các endpoint công khai và endpoint yêu cầu token.

### 5.1.2. Về frontend

Frontend React đã có các khu vực public, student, mentor và admin. Cơ chế gọi API dùng Axios interceptor để tự động gắn JWT và xử lý lỗi 401. Giao diện có các màn hình chính cho danh sách khóa học, chi tiết khóa học, học bài, quiz, tiến độ, điểm, chứng chỉ, dashboard và quản trị CRUD.

### 5.1.3. Về nghiệp vụ

Luồng nghiệp vụ chính đã được mô hình hóa từ đăng nhập, xem khóa học, ghi danh, học bài, làm quiz đến cập nhật tiến độ. Việc tách vai trò giúp mỗi nhóm người dùng chỉ nhìn thấy các chức năng phù hợp. Các chức năng mở rộng tạo nền tảng cho hệ thống gần với một sản phẩm học trực tuyến thực tế hơn.

**[Hình 5.1. Quy trình nghiệp vụ hoàn chỉnh sau triển khai: chèn ảnh/sơ đồ tổng hợp luồng từ người dùng đến chứng chỉ.]**

## 5.2. Ưu điểm và hạn chế

### 5.2.1. Ưu điểm

- Kiến trúc rõ ràng, có thể mở rộng theo module.
- Có phân quyền ở cả frontend và backend.
- Có trạng thái tải, lỗi và rỗng ở nhiều màn hình frontend.
- Dữ liệu quiz và tiến độ được lưu để phục vụ đánh giá quá trình học.
- Hỗ trợ hai loại khóa học FREE và PREMIUM.
- Có các chức năng nâng cao như chứng chỉ xác minh, wishlist, blog và chat.
- Cấu hình chạy local tương đối rõ ràng, dễ trình diễn và kiểm thử.

### 5.2.2. Hạn chế

- Một số chức năng mở rộng phụ thuộc cấu hình bên ngoài như SMTP, cổng thanh toán và Gemini API.
- Video đang dùng URL, chưa có pipeline upload, lưu trữ và phân phối riêng.
- MongoDB linh hoạt nhưng cần bổ sung validation, index và chiến lược backup khi triển khai thực tế.
- Bộ kiểm thử tự động chưa được thể hiện đầy đủ trong repository.
- Một số số liệu ở trang giới thiệu có thể là dữ liệu trình bày, cần phân biệt với số liệu thống kê thực từ backend.

## 5.3. Kết luận

Đề tài đã phân tích và triển khai được một hệ thống quản lý các khóa học lập trình với đầy đủ luồng cơ bản của nền tảng học trực tuyến: quản lý người dùng, khóa học, bài giảng, ghi danh, quiz, điểm và tiến độ. Việc sử dụng React, Spring Boot, MongoDB, JWT và WebSocket giúp project thể hiện được cả kiến thức phát triển giao diện, xây dựng API, thiết kế dữ liệu, bảo mật và tích hợp hệ thống.

Kết quả của đề tài đáp ứng mục tiêu xây dựng một nền tảng có thể vận hành cục bộ, có phân quyền rõ ràng và có khả năng phát triển thêm. Để bản báo cáo đạt chất lượng cao, phần minh chứng cần được bổ sung bằng ảnh chụp đúng phiên bản chạy thật, kết quả kiểm thử có số liệu và sơ đồ được vẽ lại thống nhất với mã nguồn.

## 5.4. Hướng phát triển

1. Bổ sung bộ kiểm thử unit, integration và end-to-end cho backend/frontend.
2. Hoàn thiện thanh toán production với webhook, chữ ký giao dịch và cơ chế đối soát.
3. Xây dựng upload video, lưu trữ object storage, phân quyền truy cập và streaming.
4. Bổ sung tìm kiếm toàn văn, phân trang và bộ lọc nâng cao.
5. Thêm thông báo email/in-app cho ghi danh, kết quả quiz và cấp chứng chỉ.
6. Hoàn thiện báo cáo thống kê theo thời gian, khóa học, giảng viên và tỷ lệ hoàn thành.
7. Bổ sung audit log cho các thao tác quản trị và thay đổi điểm.
8. Đóng gói bằng Docker Compose, bổ sung CI/CD và giám sát khi triển khai cloud.
9. Cải thiện khả năng truy cập, responsive và hỗ trợ đa ngôn ngữ đồng bộ.
10. Áp dụng cache và tối ưu truy vấn MongoDB khi số lượng người dùng tăng.

---

# TÀI LIỆU THAM KHẢO

[1] Spring, “Spring Boot Reference Documentation”, https://docs.spring.io/spring-boot/docs/current/reference/html/.

[2] Spring, “Spring Security Reference”, https://docs.spring.io/spring-security/reference/.

[3] MongoDB, “MongoDB Documentation”, https://www.mongodb.com/docs/.

[4] React, “React Documentation”, https://react.dev/.

[5] Vite, “Vite Guide”, https://vite.dev/guide/.

[6] JSON Web Tokens, “Introduction to JSON Web Tokens”, https://jwt.io/introduction.

[7] Project CMS, `README.md`, tài liệu yêu cầu, tài liệu ERD và `backend/API_DOCUMENTATION.md`, truy cập tháng 9 năm 2026.

[8] Project CMS, mã nguồn frontend tại thư mục `frontend/src` và mã nguồn backend tại thư mục `backend/src/main/java/com/cms`, truy cập tháng 9 năm 2026.

---

## CHECKLIST HOÀN THIỆN TRƯỚC KHI NỘP

- [ ] Thay toàn bộ thông tin cá nhân, MSSV, giảng viên và ngày tháng trên trang bìa.
- [ ] Chèn logo đúng quy định của trường.
- [ ] Vẽ lại 10 sơ đồ/hình theo đúng chú thích và đánh số trong danh mục hình.
- [ ] Chụp giao diện từ phiên bản đang chạy, không dùng ảnh mock không khớp project.
- [ ] Chạy đủ 26 ca kiểm thử, điền kết quả thực tế và tính tỷ lệ đạt.
- [ ] Kiểm tra các tuyên bố về thanh toán, chat, chứng chỉ và số liệu dashboard bằng dữ liệu thật.
- [ ] Chuyển các tiêu đề `#`, `##`, `###` sang Heading tương ứng trong Word.
- [ ] Cập nhật mục lục và danh mục hình tự động sau khi dàn trang.
- [ ] Kiểm tra đánh số trang: phần đầu theo quy định của khoa, nội dung chính bắt đầu từ Chương 1.
- [ ] Đọc soát lỗi chính tả, thống nhất thuật ngữ “khóa học”, “bài giảng”, “sinh viên”, “giảng viên” và “quản trị viên”.
