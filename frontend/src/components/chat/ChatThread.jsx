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

  // --- NEW: render nội dung tin nhắn, có hỗ trợ nút cho AI ---
  const renderMessageContent = (m, mine) => {
    // chỉ parse JSON cho tin nhắn của AI (Admin / hệ thống) nếu bạn muốn,
    // ở đây mình parse cho mọi tin không phải của currentUserId
    if (!mine && typeof m.content === "string") {
      try {
        const parsed = JSON.parse(m.content);
        if (
          parsed &&
          parsed.type === "button" &&
          typeof parsed.message === "string" &&
          typeof parsed.actionLabel === "string" &&
          typeof parsed.actionUrl === "string"
        ) {
          return (
            <div className="chat-bubble-content">
              <div>{parsed.message}</div>
              <button
                type="button"
                className="chat-action-button"
                onClick={() =>
                  window.open(parsed.actionUrl, "_blank", "noopener,noreferrer")
                }
              >
                {parsed.actionLabel}
              </button>
            </div>
          );
        }
      } catch {
        // không phải JSON -> hiển thị thường
      }
    }

    // mặc định: hiển thị text như cũ
    return <div className="chat-bubble-content">{m.content}</div>;
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
                {renderMessageContent(m, mine)}
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