package com.cms.dto;

import com.cms.model.ChatType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    /** Bắt buộc nếu type = SUPPORT và muốn nhắn 1 admin cụ thể; có thể để trống để hệ thống tự chọn admin */
    private String receiverId;

    /** Bắt buộc nếu type = COURSE; backend sẽ tự tìm mentor (instructorId) của khóa học */
    private String courseId;

    private ChatType type;

    private String content;
}
