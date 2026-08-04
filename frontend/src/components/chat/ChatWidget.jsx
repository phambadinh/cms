import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { getAuthUser, getAuthToken } from "../../services/api";
import { getChatConversations, getChatHistory, sendChatMessageRest } from "../../services/chatApi";
import { connectChatSocket, sendChatSocketMessage, disconnectChatSocket } from "../../services/chatSocket";
import ChatThread from "./ChatThread";
import "../../styles/chat.css";

/**
 * Chatbox hỗ trợ nổi ở góc màn hình (giống Coursera/Intercom).
 * - Ai cũng chat được với Admin (kênh SUPPORT), không cần biết trước admin nào đang trực.
 * - Backend tự động chọn 1 Admin khi gửi tin nhắn đầu tiên (xem ChatService.sendMessage).
 */
function ChatWidget() {
  const user = getAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [partnerId, setPartnerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const socketReady = useRef(false);

  useEffect(() => {
    if (!user) return;

    const token = getAuthToken();
    connectChatSocket({
      token,
      onConnect: () => {
        socketReady.current = true;
      },
      onMessage: (msg) => {
        if (msg.type !== "SUPPORT") return;

        setPartnerId((prev) => prev || (msg.senderId === user.userId ? msg.receiverId : msg.senderId));
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });

        if (!isOpen && msg.senderId !== user.userId) {
          setUnread((u) => u + 1);
        }
      },
    });

    // Nếu đã từng chat hỗ trợ trước đó, load lại hội thoại gần nhất
    (async () => {
      try {
        const res = await getChatConversations();
        const supportConvo = (res.data || []).find((c) => c.type === "SUPPORT");
        if (supportConvo) {
          setPartnerId(supportConvo.counterpartId);
          setLoading(true);
          const history = await getChatHistory(supportConvo.counterpartId, { type: "SUPPORT" });
          setMessages(history.data || []);
        }
      } catch (e) {
        console.error("Không thể tải hội thoại hỗ trợ:", e);
      } finally {
        setLoading(false);
      }
    })();

    return () => disconnectChatSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setUnread(0);
  };

  const handleSend = async (content) => {
    if (partnerId) {
      const sentViaSocket = socketReady.current && sendChatSocketMessage({
        receiverId: partnerId,
        courseId: null,
        type: "SUPPORT",
        content,
      });

      if (!sentViaSocket) {
        try {
          const res = await sendChatMessageRest({ receiverId: partnerId, type: "SUPPORT", content });
          setMessages((prev) => [...prev, res.data]);
        } catch (e) {
          console.error("Gửi tin nhắn thất bại:", e);
        }
      }
    } else {
      // Chưa có admin nào được gán -> gửi qua REST để backend tự chọn admin
      try {
        const res = await sendChatMessageRest({ type: "SUPPORT", content });
        setPartnerId(res.data.receiverId);
        setMessages((prev) => [...prev, res.data]);
      } catch (e) {
        console.error("Gửi tin nhắn thất bại:", e);
      }
    }
  };

  if (!user) return null; // chỉ hiển thị chatbox cho người đã đăng nhập

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-widget-panel">
          <div className="chat-widget-header">
            <div>
              <div className="chat-widget-title">Hỗ trợ CMS</div>
              <div className="chat-widget-subtitle">Đội ngũ CMS phản hồi trong 24 giờ</div>
            </div>
            <button className="chat-widget-close" onClick={handleToggle} aria-label="Đóng chat">
              <X size={18} />
            </button>
          </div>

          <ChatThread
            messages={messages}
            currentUserId={user.userId}
            onSend={handleSend}
            loading={loading}
            placeholder="Nhập câu hỏi cần hỗ trợ..."
          />
        </div>
      )}

      <button className="chat-widget-fab" onClick={handleToggle} aria-label="Mở chat hỗ trợ">
        <MessageCircle size={24} />
        {unread > 0 && <span className="chat-widget-badge">{unread}</span>}
      </button>
    </div>
  );
}

export default ChatWidget;