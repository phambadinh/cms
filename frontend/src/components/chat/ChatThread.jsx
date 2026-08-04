import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

/**
 * props:
 * - messages: [{ id, senderId, senderName, content, createdAt }]
 * - currentUserId
 * - onSend(content)
 * - loading
 * - placeholder
 */
function ChatThread({ messages, currentUserId, onSend, loading, placeholder }) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setDraft("");
  };

  return (
    <div className="chat-thread">
      <div className="chat-thread-messages">
        {loading && <p className="chat-thread-loading">Đang tải tin nhắn...</p>}

        {!loading && messages.length === 0 && (
          <p className="chat-thread-empty">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
        )}

        {messages.map((m) => {
          const mine = m.senderId === currentUserId;
          return (
            <div key={m.id} className={`chat-bubble-row ${mine ? "mine" : ""}`}>
              <div className={`chat-bubble ${mine ? "mine" : "theirs"}`}>
                {!mine && <div className="chat-bubble-sender">{m.senderName}</div>}
                <div className="chat-bubble-content">{m.content}</div>
                <div className="chat-bubble-time">{formatTime(m.createdAt)}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className="chat-thread-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder || "Nhập tin nhắn..."}
        />
        <button type="submit" aria-label="Gửi tin nhắn" disabled={!draft.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default ChatThread;