package com.cms.service.impl;

import org.springframework.stereotype.Service;

@Service
public class AuthEmailTemplateService {
    private static final String LOGO_SVG = """
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cmsLogoGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#2563eb" />
                  <stop offset="100%" stop-color="#60a5fa" />
                </linearGradient>
              </defs>
              <rect width="48" height="48" rx="14" fill="url(#cmsLogoGradient)"/>
              <path d="M14 24C14 18.4772 18.4772 14 24 14C27.3969 14 30.3859 15.6932 32.193 18.2849L28.1428 20.9316C27.2637 19.5134 25.7024 18.5714 24 18.5714C21.2386 18.5714 19 20.8099 19 23.5714C19 26.333 21.2386 28.5714 24 28.5714C25.7024 28.5714 27.2637 27.6293 28.1428 26.2111L32.193 28.8578C30.3859 31.4496 27.3969 33.1428 24 33.1428C18.4772 33.1428 14 28.6656 14 24Z" fill="white"/>
            </svg>
            """;

    public String buildResetPasswordHtml(String resetLink) {
        return buildTemplate(
                "Đặt lại mật khẩu",
          "Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Liên kết bên dưới sẽ hết hạn sau 1 giờ.",
                "Đặt lại mật khẩu",
                resetLink,
                "Nếu nút không hoạt động, hãy copy đường dẫn này:",
                "Nếu bạn không yêu cầu, hãy bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.",
          "Mở liên kết đặt lại mật khẩu"
        );
    }

    public String buildVerificationHtml(String verifyLink, String fullName, String email) {
        String greetingName = fullName != null && !fullName.isBlank() ? fullName : email;
        return buildTemplate(
                "Xác minh email",
            "Chào " + greetingName + ", hãy xác minh email của bạn để hoàn tất đăng ký và kích hoạt tài khoản Hệ thống quản lý khóa học.",
                "Xác minh email",
                verifyLink,
                "Nếu nút không hoạt động, hãy copy đường dẫn này:",
                "Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.",
            "Mở liên kết xác minh email"
        );
    }

    public String buildResetPasswordText(String resetLink) {
        return "Hệ thống quản lý khóa học | Đặt lại mật khẩu\n\n"
          + "Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\n"
          + "Liên kết bên dưới sẽ hết hạn sau 1 giờ:\n"
          + resetLink + "\n\n"
          + "Nếu bạn không yêu cầu, hãy bỏ qua email này.\n\n"
          + "Hệ thống quản lý khóa học\n"
          + "Trang web: https://www.cms.local\n"
          + "Hỗ trợ: support@cms.local\n"
          + "LinkedIn: https://www.linkedin.com/dinhphamba";
    }

    public String buildVerificationText(String verifyLink, String fullName, String email) {
        String greetingName = fullName != null && !fullName.isBlank() ? fullName : email;
        return "Hệ thống quản lý khóa học | Xác minh email\n\n"
          + "Chào " + greetingName + ",\n"
          + "Vui lòng xác minh email để hoàn tất đăng ký và kích hoạt tài khoản Hệ thống quản lý khóa học.\n"
          + "Liên kết xác minh:\n"
          + verifyLink + "\n\n"
          + "Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.\n\n"
          + "Hệ thống quản lý khóa học\n"
          + "Trang web: https://www.cms.local\n"
          + "Hỗ trợ: support@cms.local\n"
          + "LinkedIn: https://www.linkedin.com/dinhphamba";
    }

    private String buildTemplate(String title, String leadText, String ctaText, String ctaLink, String fallbackLabel, String footerText, String accessibilityLabel) {
        return """
                <div style="margin:0;padding:0;background:#f4f8ff;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
                  <div style="max-width:680px;margin:0 auto;padding:28px 16px 36px;">
                    <div style="border-radius:28px;overflow:hidden;background:#ffffff;border:1px solid #dbeafe;box-shadow:0 20px 45px rgba(15,23,42,0.08);">
                      <div style="padding:24px 28px 22px;background:linear-gradient(135deg,#eff6ff,#dbeafe);border-bottom:1px solid #cfe0ff;">
                        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
                          <div style="display:flex;align-items:center;gap:14px;">
                            <div style="width:48px;height:48px;flex:none;">%s</div>
                            <div>
                              <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:#2563eb;font-weight:700;">Hệ thống quản lý khóa học</div>
                              <div style="margin-top:4px;font-size:15px;color:#475569;">Nền tảng học tập chuyên nghiệp</div>
                            </div>
                          </div>
                          <div style="padding:8px 12px;border-radius:999px;background:#ffffff;border:1px solid #bfdbfe;color:#2563eb;font-size:12px;font-weight:700;">%s</div>
                        </div>
                      </div>
                      <div style="padding:34px 30px 28px;">
                        <p style="margin:0 0 10px;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#2563eb;font-weight:700;">Hệ thống quản lý khóa học</p>
                        <p style="margin:0 0 16px;font-size:18px;line-height:1.3;font-weight:700;color:#0f172a;">%s</p>
                        <p style="margin:0 0 18px;font-size:16px;line-height:1.8;color:#334155;">%s</p>
                        <div style="text-align:center;margin:32px 0 24px;">
                          <a href="%s" aria-label="%s" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;box-shadow:0 12px 24px rgba(37,99,235,.22);">%s</a>
                        </div>
                        <p style="margin:0 0 8px;color:#64748b;font-size:14px;">%s</p>
                        <p style="margin:0 0 18px;word-break:break-all;font-size:14px;line-height:1.6;">
                          <a href="%s" style="color:#2563eb;">%s</a>
                        </p>
                        <p style="margin:0;color:#64748b;font-size:14px;line-height:1.7;">%s</p>
                      </div>
                      <div style="padding:18px 30px 26px;border-top:1px solid #e2e8f0;background:#f8fbff;">
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;">
                          <div style="max-width:340px;">
                            <div style="font-size:14px;font-weight:700;color:#0f172a;">Hệ thống quản lý khóa học</div>
                            <div style="margin-top:4px;font-size:13px;color:#64748b;line-height:1.6;">Học nhanh hơn với lộ trình rõ ràng, người hướng dẫn đáng tin cậy và trải nghiệm học tập gọn gàng.</div>
                          </div>
                          <div style="display:flex;gap:10px;flex-wrap:wrap;">
                            <a href="%s" style="padding:9px 14px;border-radius:999px;border:1px solid #cbd5e1;color:#334155;text-decoration:none;font-size:13px;font-weight:600;">Trang web</a>
                            <a href="mailto:%s" style="padding:9px 14px;border-radius:999px;border:1px solid #cbd5e1;color:#334155;text-decoration:none;font-size:13px;font-weight:600;">Hỗ trợ</a>
                            <a href="https://www.linkedin.com/in/dinhphamba" style="padding:9px 14px;border-radius:999px;border:1px solid #cbd5e1;color:#334155;text-decoration:none;font-size:13px;font-weight:600;">LinkedIn</a>
                          </div>
                        </div>
                        <div style="margin-top:14px;font-size:12px;color:#94a3b8;line-height:1.6;">Đây là email được gửi tự động. Vui lòng không phản hồi trực tiếp vào thư này.</div>
                      </div>
                    </div>
                  </div>
                </div>
                """.formatted(LOGO_SVG, title, title, leadText, ctaLink, accessibilityLabel, ctaText, fallbackLabel, ctaLink, ctaLink, footerText, "https://www.cms.local", "support@cms.local");
    }
}
