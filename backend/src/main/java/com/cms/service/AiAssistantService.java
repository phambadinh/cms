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
 * Gọi Google Gemini API (miễn phí, không cần thẻ tín dụng - qua Google AI Studio)
 * để trả lời tự động các câu hỏi hỗ trợ thường gặp.
 *
 * Cấu hình trong application.properties:
 *   gemini.api.key=AIzaSy-xxxxxxxx
 *   gemini.model=gemini-2.5-flash
 */
@Service
public class AiAssistantService {

    private static final String API_URL_TEMPLATE =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-flash-latest}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT = """
            Bạn là Trợ lý hỗ trợ của nền tảng học trực tuyến CMS Learning.
            Trả lời NGẮN GỌN (tối đa 4 câu), thân thiện, bằng tiếng Việt.
            Các thông tin bạn có thể hỗ trợ:
            - Đăng ký khóa học: khóa FREE ghi danh ngay, khóa PREMIUM cần thanh toán
              (VNPAY/MOMO) và xác nhận thành công mới truy cập được nội dung.
            - Sau khi xem xong video bài học, học viên sẽ làm bài trắc nghiệm (quiz) của bài đó.
            - Nếu câu hỏi liên quan tài khoản, thanh toán bị lỗi, khiếu nại hoặc cần con người xử lý,
              hãy nói rõ là bạn sẽ chuyển tiếp cho nhân viên hỗ trợ (Admin) kiểm tra và trả lời sớm.
            - Nếu không chắc chắn câu trả lời, đừng bịa thông tin - hãy nói sẽ chuyển cho Admin.
            """;

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

    public String generateReply(String userMessage) {
        if (!isEnabled()) {
            return null;
        }

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
            // Không để lỗi gọi AI làm crash luồng chat chính
            System.err.println("AiAssistantService (Gemini) error: " + e.getMessage());
            return null;
        }
    }
}