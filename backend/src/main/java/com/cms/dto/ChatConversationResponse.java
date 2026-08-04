package com.cms.dto;

import com.cms.model.ChatType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatConversationResponse {
    private String counterpartId;
    private String counterpartName;
    private String counterpartRole;
    private String courseId;
    private String courseName;
    private ChatType type;
    private String lastMessage;
    private Instant lastMessageAt;
    private long unreadCount;
}
