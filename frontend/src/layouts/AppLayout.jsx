import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatWidget from "../components/chat/ChatWidget";
import "../styles/app-layout.css";

function AppLayout() {
  return (
    <div className="app-layout-shell">
      <Sidebar />

      <div className="app-layout-body">
        <Header />

        <main className="app-layout-main">
          <Outlet />
        </main>
      </div>

      {/* Chatbox hỗ trợ nổi - hiển thị trên mọi trang cho user đã đăng nhập */}
      <ChatWidget />
    </div>
  );
}

export default AppLayout;