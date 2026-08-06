package com.cms.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Gọi Google Gemini API để trả lời tự động các câu hỏi hỗ trợ.
 * Hỗ trợ: đổi mật khẩu, tiến độ học, học phí, quiz, đăng ký khóa học, thanh toán.
 *
 * Cấu hình trong application.properties:
 *   gemini.api.key=AIzaSy-xxxxxxxx
 *   gemini.model=gemini-2.5-flash
 *   app.frontend-base-url=http://localhost:5173
 */
@SuppressWarnings("null")
@Service
public class AiAssistantService {

    private static final String API_URL_TEMPLATE =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-flash-latest}")
    private String model;

    // base URL cho frontend, dùng để build link nút
    @Value("${app.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT = """
            Bạn là Trợ lý hỗ trợ của nền tảng học trực tuyến CMS Learning.
            Trả lời NGẮN GỌN (tối đa 4 câu), thân thiện, bằng tiếng Việt.
            Các thông tin bạn có thể hỗ trợ:
            - Đăng ký khóa học: khóa FREE ghi danh ngay, khóa PREMIUM cần thanh toán
              (VNPAY/MOMO) và xác nhận thành công mới truy cập được nội dung.
            - Sau khi xem xong video bài học, học viên sẽ làm bài trắc nghiệm (quiz) của bài đó.
            - Tiến độ học: Mỗi bài học có video + quiz, hoàn thành quiz để mở bài tiếp theo.
            - Học phí: Khóa FREE không mất phí, khóa PREMIUM có giá từ 99.000đ - 499.000đ/khóa.
            - Quiz: Trắc nghiệm sau mỗi video, cần đạt 70% để hoàn thành bài.
            - Nếu câu hỏi liên quan tài khoản, thanh toán bị lỗi, khiếu nại hoặc cần con người xử lý,
              hãy nói rõ là bạn sẽ chuyển tiếp cho nhân viên hỗ trợ (Admin) kiểm tra và trả lời sớm.
            - Nếu không chắc chắn câu trả lời, đừng bịa thông tin - hãy nói sẽ chuyển cho Admin.
            """;

    // Keyword mapping: mỗi list keyword tương ứng với 1 loại câu hỏi
    private static final Map<String, List<String>> FEATURE_KEYWORDS = Map.of(
            "password_reset", List.of(
                    "đổi mật khẩu", "đổi password", "thay mật khẩu", "thay password",
                    "quên mật khẩu", "quên password", "lấy lại mật khẩu", "lấy lại password",
                    "reset password", "reset mật khẩu", "cấp lại mật khẩu"
            ),
            "learning_progress", List.of(
                    "tiến độ học", "tiến độ", "học đến đâu", "bao nhiêu phần trăm",
                    "% hoàn thành", "hoàn thành", "xem được bao nhiêu", "bao nhiêu bài",
                    "status học", "trạng thái học"
            ),
            "pricing", List.of(
                    "học phí", "giá khóa học", "bao nhiêu tiền", "phí học", "thanh toán",
                    "mua khóa học", "giá bao nhiêu", "cost", "price", "phí"
            ),
            "quiz", List.of(
                    "quiz", "trắc nghiệm", "bài kiểm tra", "bài thi", "làm quiz",
                    "test", "exam", "điểm quiz", "kết quả quiz", "quiz ở đâu"
            ),
            "course_access", List.of(
                    "truy cập khóa học", "vào khóa học", "xem bài giảng", "học bài nào",
                    "bắt đầu học", "học như thế nào", "làm sao để học", "cách học"
            )
    );

    // Tin nhắn mô tả cho từng tính năng
    private static final Map<String, String> FEATURE_MESSAGES = Map.of(
            "password_reset", "Để đổi mật khẩu, bạn bấm nút bên dưới:",
            "learning_progress", "Bạn có thể xem tiến độ học tại đây:",
            "pricing", "Đây là thông tin học phí các khóa học:",
            "quiz", "Bạn có thể làm quiz tại đây:",
            "course_access", "Bạn có thể truy cập khóa học tại đây:"
    );

    // Nhãn nút cho từng tính năng
    private static final Map<String, String> FEATURE_LABELS = Map.of(
            "password_reset", "Đổi mật khẩu ngay",
            "learning_progress", "Xem tiến độ học",
            "pricing", "Xem học phí",
            "quiz", "Vào quiz ngay",
            "course_access", "Vào học ngay"
    );

    private String buildUrl(String path) {
        // đảm bảo có base URL đúng
        return frontendBaseUrl + path;
    }

    public boolean isEnabled() {
        return apiKey != null && !apiKey.isBlank();
    }

    @PostConstruct
    public void logStartupStatus() {
        if (isEnabled()) {
            String masked = apiKey.length() > 8
                    ? apiKey.substring(0, 6) + "..." + apiKey.substring(apiKey.length() - 4)
                    : "(quá ngắn, có thể sai)";
            System.out.println("[AiAssistantService] Gemini AI ĐÃ BẬT - model=" + model + " - key=" + masked);
        } else {
            System.out.println("[AiAssistantService] Gemini AI ĐANG TẮT - gemini.api.key đang RỖNG. "
                    + "Kiểm tra lại biến môi trường GEMINI_API_KEY hoặc application.properties.");
        }
    }

    /**
     * Sinh trả lời cho tin nhắn người dùng.
     * Nếu match keyword tính năng -> trả về JSON dạng nút.
     * Ngược lại -> gọi Gemini để trả lời text.
     */
    public String generateReply(String userMessage) {
        if (!isEnabled()) {
            return null;
        }

        // 1. Nếu người dùng hỏi về các tính năng đã định nghĩa, trả về dạng "nút"
        String feature = detectFeature(userMessage);
        if (feature != null) {
            String path = switch (feature) {
                case "password_reset" -> "/forgot-password";
                case "learning_progress" -> "/progress";
                case "pricing" -> "/pricing";
                case "quiz" -> "/quiz";
                case "course_access" -> "/courses";
                default -> "/";
            };
            String actionUrl = buildUrl(path);
            String message = FEATURE_MESSAGES.getOrDefault(feature, "Bạn có thể thao tác tại trang sau:");
            String actionLabel = FEATURE_LABELS.getOrDefault(feature, "Mở trang");

            try {
                // Trả về JSON string cho frontend
                return objectMapper.writeValueAsString(Map.of(
                        "type", "button",
                        "message", message,
                        "actionLabel", actionLabel,
                        "actionUrl", actionUrl
                ));
            } catch (Exception e) {
                // fallback: text thường + url
                return message + " " + actionUrl;
            }
        }

        // 2. Nếu không khớp keyword, gọi Gemini API
        try {
            String url = String.format(API_URL_TEMPLATE, model, apiKey);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                    "system_instruction", Map.of(
                            "parts", List.of(Map.of("text", SYSTEM_PROMPT))
                    ),
                    "contents", List.of(
                            Map.of("role", "user", "parts", List.of(Map.of("text", userMessage)))
                    ),
                    "generationConfig", Map.of("maxOutputTokens", 300)
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText();
                }
            }
            return null;
        } catch (Exception e) {
            System.err.println("AiAssistantService (Gemini) error: " + e.getMessage());
            return null;
        }
    }

    /**
     * Phát hiện tính năng người dùng đang hỏi dựa trên keyword.
     */
    private String detectFeature(String message) {
        if (message == null || message.isBlank()) {
            return null;
        }
        String lowerMessage = message.toLowerCase().trim();

        for (Map.Entry<String, List<String>> entry : FEATURE_KEYWORDS.entrySet()) {
            String feature = entry.getKey();
            List<String> keywords = entry.getValue();
            if (keywords.stream().anyMatch(lowerMessage::contains)) {
                return feature;
            }
        }
        return null;
    }
}