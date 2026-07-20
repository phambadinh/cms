# CMS workflow and database cleanup plan

## 1. Workflow chuẩn cho hệ thống

### Auth
1. User đăng ký -> validate username/email/password.
2. User đăng nhập -> JWT issued only when account is active.
3. Quên mật khẩu -> backend tạo token, gửi email, trả về message; nếu environment dev thì có thể trả resetLink cho test.
4. Reset password -> token phải còn hiệu lực và chưa hết hạn.

### Course enrollment
1. Free course:
   - create enrollment with status ACTIVE and paymentStatus COMPLETED immediately.
2. Premium course:
   - create enrollment with status PENDING and paymentStatus PENDING.
   - redirect to payment flow.
   - only after payment confirmation move to ACTIVE + COMPLETED payment status.

### Payment
1. Initiate payment -> backend creates/updates enrollment as pending.
2. User confirms payment -> backend verifies transaction metadata (transactionId/sessionId/paymentMethod) and marks payment as completed.
3. Enrollment status becomes ACTIVE and paymentStatus becomes COMPLETED.
4. If payment fails/cancelled -> status remains PENDING/FAILED/CANCELLED; course content remains locked.

## 2. Database changes recommended

### Collections / documents
- users
  - add passwordUpdatedAt, lastLoginAt, failedLoginAttempts, lockedUntil, emailVerified, createdAt, updatedAt.
- enrollments
  - move to enum-based fields for status/paymentStatus.
  - add paymentMethod, transactionId, sessionId, paymentCompletedAt.
- password_reset_tokens
  - add usedAt, createdAt, expiresAt.
- courses
  - add isPublished, priceCurrency, refundPolicy (optional), supportEmail (optional).

### Security recommendations
- Passwords must be hashed with BCrypt.
- Do not store plaintext secrets.
- Use environment variables for SMTP, JWT secret, and payment provider credentials.
- Restrict admin routes to ADMIN/MENTOR roles only.
- Add rate limiting on auth and password-reset endpoints.
- Log payment events auditable (userId, courseId, paymentMethod, status, transactionId, timestamp).

## 3. Suggested next implementation steps
- Add server-side verification for payment providers.
- Add audit log collection for payments and auth actions.
- Add index on users.email, users.username, enrollments.userId+courseId, password_reset_tokens.token.
- Add API-level validation and error codes instead of raw strings.
