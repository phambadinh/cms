package com.cms.controller;

import com.cms.dto.ChatConversationResponse;
import com.cms.dto.ChatMessageRequest;
import com.cms.dto.ChatMessageResponse;
import com.cms.model.ChatMessage;
import com.cms.model.ChatType;
import com.cms.service.AutoReplyService;
import com.cms.service.ChatService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final AutoReplyService autoReplyService;

    public ChatController(ChatService chatService,
                           SimpMessagingTemplate messagingTemplate,
                           AutoReplyService autoReplyService) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
        this.autoReplyService = autoReplyService;
    }

    @GetMapping("/conversations")
    public List<ChatConversationResponse> getConversations(Authentication authentication) {
        return chatService.getConversations(authentication.getName());
    }

    @GetMapping("/history")
    public List<ChatMessageResponse> getHistory(
            @RequestParam String withUserId,
            @RequestParam(required = false) String courseId,
            @RequestParam ChatType type,
            Authentication authentication) {

        List<ChatMessageResponse> history = chatService.getHistory(authentication.getName(), withUserId, courseId, type);
        chatService.markConversationAsRead(authentication.getName(), withUserId, courseId, type);
        return history;
    }

    @PostMapping("/send")
    public ChatMessageResponse sendMessage(@RequestBody ChatMessageRequest request, Authentication authentication) {
        ChatMessageResponse saved = chatService.sendMessage(authentication.getName(), request);
        messagingTemplate.convertAndSendToUser(saved.getReceiverId(), "/queue/messages", saved);
        messagingTemplate.convertAndSendToUser(saved.getSenderId(), "/queue/messages", saved);

        // NEW: kích hoạt AI trả lời tự động cho kênh SUPPORT
        if (saved.getType() == ChatType.SUPPORT) {
            ChatMessage forAutoReply = new ChatMessage(
                    saved.getId(), saved.getSenderId(), saved.getSenderName(), saved.getSenderRole(),
                    saved.getReceiverId(), saved.getCourseId(), saved.getType(), saved.getContent(),
                    saved.isRead(), saved.getCreatedAt() != null ? saved.getCreatedAt() : Instant.now()
            );
            autoReplyService.maybeAutoReply(forAutoReply);
        }

        return saved;
    }
}
