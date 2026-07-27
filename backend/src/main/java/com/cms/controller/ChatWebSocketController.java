package com.cms.controller;

import com.cms.dto.ChatMessageRequest;
import com.cms.dto.ChatMessageResponse;
import com.cms.model.ChatMessage;
import com.cms.model.ChatType;
import com.cms.service.AutoReplyService;
import com.cms.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final AutoReplyService autoReplyService;

    public ChatWebSocketController(ChatService chatService,
                                    SimpMessagingTemplate messagingTemplate,
                                    AutoReplyService autoReplyService) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
        this.autoReplyService = autoReplyService;
    }

    // Client gửi tới: /app/chat.send
    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageRequest request, Principal principal) {
        String senderId = principal.getName();

        ChatMessageResponse saved = chatService.sendMessage(senderId, request);

        // Đẩy realtime tới người nhận
        messagingTemplate.convertAndSendToUser(saved.getReceiverId(), "/queue/messages", saved);

        // Đẩy lại cho chính người gửi để đồng bộ nếu họ mở nhiều tab/thiết bị
        messagingTemplate.convertAndSendToUser(saved.getSenderId(), "/queue/messages", saved);

        // NEW: nếu là tin nhắn hỗ trợ (SUPPORT), gọi AI trả lời tự động (bất đồng bộ, không chặn)
        if (saved.getType() == ChatType.SUPPORT) {
            ChatMessage forAutoReply = new ChatMessage(
                    saved.getId(), saved.getSenderId(), saved.getSenderName(), saved.getSenderRole(),
                    saved.getReceiverId(), saved.getCourseId(), saved.getType(), saved.getContent(),
                    saved.isRead(), saved.getCreatedAt() != null ? saved.getCreatedAt() : Instant.now()
            );
            autoReplyService.maybeAutoReply(forAutoReply);
        }
    }
}
