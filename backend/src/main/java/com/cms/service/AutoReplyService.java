package com.cms.service;

import com.cms.model.ChatMessage;
import com.cms.model.ChatType;
import com.cms.repository.ChatMessageRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AutoReplyService {

    public static final String AI_ASSISTANT_ID = "AI_ASSISTANT";
    public static final String AI_ASSISTANT_NAME = "Trợ lý AI (CMS)";

    private final AiAssistantService aiAssistantService;
    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public AutoReplyService(AiAssistantService aiAssistantService,
                             ChatMessageRepository chatMessageRepository,
                             SimpMessagingTemplate messagingTemplate) {
        this.aiAssistantService = aiAssistantService;
        this.chatMessageRepository = chatMessageRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Chỉ tự động trả lời cho tin nhắn kênh SUPPORT, gửi bởi người dùng thật
     * (không lặp vô hạn khi chính bot hoặc admin gửi).
     */
    
    @SuppressWarnings("null")
    @Async
    public void maybeAutoReply(ChatMessage userMessage) {
        if (userMessage.getType() != ChatType.SUPPORT) return;
        if (AI_ASSISTANT_ID.equals(userMessage.getSenderId())) return;
        if (!aiAssistantService.isEnabled()) return;

        String reply = aiAssistantService.generateReply(userMessage.getContent());
        if (reply == null || reply.isBlank()) return;

        ChatMessage botMessage = new ChatMessage();
        botMessage.setSenderId(AI_ASSISTANT_ID);
        botMessage.setSenderName(AI_ASSISTANT_NAME);
        botMessage.setSenderRole("BOT");
        botMessage.setReceiverId(userMessage.getSenderId());
        botMessage.setCourseId(null);
        botMessage.setType(ChatType.SUPPORT);
        botMessage.setContent(reply.trim());
        botMessage.setRead(false);
        botMessage.setCreatedAt(Instant.now());

        ChatMessage saved = chatMessageRepository.save(botMessage);

        messagingTemplate.convertAndSendToUser(saved.getReceiverId(), "/queue/messages", saved);
    }
}
