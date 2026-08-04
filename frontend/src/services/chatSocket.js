import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_BASE_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080";

let stompClient = null;

/**
 * Kết nối WebSocket (STOMP qua SockJS), gửi JWT qua query param ?token=
 * vì SockJS handshake không cho gắn header Authorization như REST.
 */
export function connectChatSocket({ token, onMessage, onConnect, onError }) {
  if (stompClient && stompClient.active) {
    return stompClient;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws?token=${encodeURIComponent(token)}`),
    reconnectDelay: 4000,
    onConnect: () => {
      stompClient.subscribe("/user/queue/messages", (frame) => {
        try {
          const body = JSON.parse(frame.body);
          onMessage?.(body);
        } catch (e) {
          console.error("Lỗi parse tin nhắn chat:", e);
        }
      });
      onConnect?.();
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame);
      onError?.(frame);
    },
  });

  stompClient.activate();
  return stompClient;
}

export function sendChatSocketMessage({ receiverId, courseId, type, content }) {
  if (!stompClient || !stompClient.active) {
    console.warn("Chat socket chưa kết nối, không thể gửi realtime.");
    return false;
  }

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({ receiverId, courseId, type, content }),
  });
  return true;
}

export function disconnectChatSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}