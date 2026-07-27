package com.cms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Tin nhắn chat 1-1 giữa Student <-> Mentor (theo courseId)
 * hoặc Student <-> Admin (kênh hỗ trợ, courseId = null).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_messages")
public class ChatMessage {
    @Id
    private String id;

    private String senderId;
    private String senderName;
    private String senderRole;

    private String receiverId;

    /** Null nếu là tin nhắn hỗ trợ (SUPPORT) gửi tới Admin */
    private String courseId;

    private ChatType type; // COURSE hoặc SUPPORT

    private String content;

    private boolean read;

    private Instant createdAt;
}
