import { apiClient } from "./api";

/** Danh sách hội thoại (inbox) của user hiện tại */
export const getChatConversations = () => {
  return apiClient.get("/chat/conversations");
};

/** Lịch sử chat với 1 người (type: "COURSE" | "SUPPORT") */
export const getChatHistory = (withUserId, { courseId, type } = {}) => {
  return apiClient.get("/chat/history", {
    params: { withUserId, courseId, type },
  });
};

/** Gửi tin nhắn qua REST (fallback nếu WebSocket chưa sẵn sàng) */
export const sendChatMessageRest = ({ receiverId, courseId, type, content }) => {
  return apiClient.post("/chat/send", { receiverId, courseId, type, content });
};