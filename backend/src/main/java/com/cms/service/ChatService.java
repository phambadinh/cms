package com.cms.service;

import com.cms.dto.ChatConversationResponse;
import com.cms.dto.ChatMessageRequest;
import com.cms.dto.ChatMessageResponse;
import com.cms.model.ChatMessage;
import com.cms.model.ChatType;
import com.cms.model.Course;
import com.cms.model.User;
import com.cms.model.UserRole;
import com.cms.repository.ChatMessageRepository;
import com.cms.repository.CourseRepository;
import com.cms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
@SuppressWarnings("null")
@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public ChatService(ChatMessageRepository chatMessageRepository,
                        UserRepository userRepository,
                        CourseRepository courseRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Gửi 1 tin nhắn. Tự động xác định receiverId:
     * - COURSE: lấy instructorId của khóa học làm receiver (nếu người gửi không phải mentor đó,
     *   ngược lại nếu chính mentor gửi thì receiverId phải được truyền vào - id của student).
     * - SUPPORT: nếu không truyền receiverId, tự chọn 1 tài khoản ADMIN đang hoạt động.
     */
    public ChatMessageResponse sendMessage(String senderId, ChatMessageRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Người gửi không tồn tại"));

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("Nội dung tin nhắn không được để trống");
        }

        ChatType type = request.getType() == null ? ChatType.SUPPORT : request.getType();
        String receiverId = request.getReceiverId();
        String courseId = request.getCourseId();

        if (type == ChatType.COURSE) {
            if (courseId == null || courseId.isBlank()) {
                throw new RuntimeException("Thiếu courseId cho tin nhắn loại COURSE");
            }
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Khóa học không tồn tại"));

            if (Objects.equals(course.getInstructorId(), senderId)) {
                // Mentor đang trả lời -> bắt buộc phải biết đang trả lời student nào
                if (receiverId == null || receiverId.isBlank()) {
                    throw new RuntimeException("Thiếu receiverId (học viên) khi mentor gửi tin nhắn");
                }
            } else {
                // Student gửi -> receiver luôn là mentor của khóa học
                receiverId = course.getInstructorId();
            }
        } else { // SUPPORT
            if (receiverId == null || receiverId.isBlank()) {
                List<User> admins = userRepository.findByRole(UserRole.ADMIN);
                if (admins.isEmpty()) {
                    throw new RuntimeException("Hiện chưa có Admin nào để hỗ trợ, vui lòng thử lại sau");
                }
                receiverId = admins.get(0).getId();
            }
            courseId = null;
        }

        ChatMessage message = new ChatMessage();
        message.setSenderId(senderId);
        message.setSenderName(sender.getFullName() != null ? sender.getFullName() : sender.getUsername());
        message.setSenderRole(sender.getRole() != null ? sender.getRole().name() : "STUDENT");
        message.setReceiverId(receiverId);
        message.setCourseId(courseId);
        message.setType(type);
        message.setContent(request.getContent().trim());
        message.setRead(false);
        message.setCreatedAt(Instant.now());

        ChatMessage saved = chatMessageRepository.save(message);
        return toResponse(saved);
    }

    public List<ChatMessageResponse> getHistory(String userId, String otherUserId, String courseId, ChatType type) {
        List<ChatMessage> messages;
        if (type == ChatType.COURSE) {
            messages = chatMessageRepository.findCourseConversation(userId, otherUserId, courseId);
        } else {
            messages = chatMessageRepository.findSupportConversation(userId, otherUserId);
        }
        messages.sort(Comparator.comparing(ChatMessage::getCreatedAt));
        return messages.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Danh sách hội thoại (inbox) của 1 user - dùng cho Mentor/Admin xem ai đang nhắn, và Student xem lịch sử. */
    public List<ChatConversationResponse> getConversations(String userId) {
        List<ChatMessage> all = chatMessageRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId);

        Map<String, ChatConversationResponse> grouped = new LinkedHashMap<>();

        for (ChatMessage m : all) {
            String counterpartId = m.getSenderId().equals(userId) ? m.getReceiverId() : m.getSenderId();
            String key = m.getType() + "|" + counterpartId + "|" + (m.getCourseId() == null ? "" : m.getCourseId());

            ChatConversationResponse convo = grouped.get(key);
            if (convo == null) {
                User counterpart = userRepository.findById(counterpartId).orElse(null);
                String courseName = null;
                if (m.getCourseId() != null) {
                    courseName = courseRepository.findById(m.getCourseId()).map(Course::getName).orElse(null);
                }
                convo = new ChatConversationResponse();
                convo.setCounterpartId(counterpartId);
                convo.setCounterpartName(counterpart != null
                        ? (counterpart.getFullName() != null ? counterpart.getFullName() : counterpart.getUsername())
                        : "Người dùng");
                convo.setCounterpartRole(counterpart != null && counterpart.getRole() != null ? counterpart.getRole().name() : null);
                convo.setCourseId(m.getCourseId());
                convo.setCourseName(courseName);
                convo.setType(m.getType());
                convo.setLastMessage(m.getContent());
                convo.setLastMessageAt(m.getCreatedAt());
                convo.setUnreadCount(0);
                grouped.put(key, convo);
            }

            if (!m.isRead() && m.getReceiverId().equals(userId)) {
                convo.setUnreadCount(convo.getUnreadCount() + 1);
            }
        }

        List<ChatConversationResponse> result = new ArrayList<>(grouped.values());
        result.sort((a, b) -> b.getLastMessageAt().compareTo(a.getLastMessageAt()));
        return result;
    }

    public void markConversationAsRead(String userId, String otherUserId, String courseId, ChatType type) {
        List<ChatMessage> messages = type == ChatType.COURSE
                ? chatMessageRepository.findCourseConversation(userId, otherUserId, courseId)
                : chatMessageRepository.findSupportConversation(userId, otherUserId);

        List<ChatMessage> toUpdate = messages.stream()
                .filter(m -> m.getReceiverId().equals(userId) && !m.isRead())
                .collect(Collectors.toList());

        toUpdate.forEach(m -> m.setRead(true));
        if (!toUpdate.isEmpty()) {
            chatMessageRepository.saveAll(toUpdate);
        }
    }

    public ChatMessageResponse toResponse(ChatMessage m) {
        return new ChatMessageResponse(
                m.getId(), m.getSenderId(), m.getSenderName(), m.getSenderRole(),
                m.getReceiverId(), m.getCourseId(), m.getType(), m.getContent(),
                m.isRead(), m.getCreatedAt()
        );
    }
}
