package com.cms.dto;

import com.cms.model.ChatType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String id;
    private String senderId;
    private String senderName;
    private String senderRole;
    private String receiverId;
    private String courseId;
    private ChatType type;
    private String content;
    private boolean read;
    private Instant createdAt;
}
