package com.cms.repository;

import com.cms.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    // Lịch sử chat COURSE giữa 2 user trong 1 khóa học cụ thể
    @Query("{ 'courseId': ?2, $or: [ { 'senderId': ?0, 'receiverId': ?1 }, { 'senderId': ?1, 'receiverId': ?0 } ] }")
    List<ChatMessage> findCourseConversation(String userIdA, String userIdB, String courseId);

    // Lịch sử chat SUPPORT giữa 2 user (courseId = null)
    @Query("{ 'courseId': null, $or: [ { 'senderId': ?0, 'receiverId': ?1 }, { 'senderId': ?1, 'receiverId': ?0 } ] }")
    List<ChatMessage> findSupportConversation(String userIdA, String userIdB);

    // Tất cả tin nhắn liên quan tới 1 user (dùng để build danh sách hội thoại / inbox)
    List<ChatMessage> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(String senderId, String receiverId);

    long countByReceiverIdAndReadFalse(String receiverId);
}
