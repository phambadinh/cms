import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatWidget from "../components/chat/ChatWidget";
import "../styles/app-layout.css";

function AppLayout() {
  return (
    <div className="app-layout-shell">
      <Header />

      <main className="app-layout-main">
        <Outlet />
      </main>

      <Footer />

      {/* Chatbox hỗ trợ nổi - hiển thị trên mọi trang cho user đã đăng nhập */}
      <ChatWidget />
    </div>
  );
}

export default AppLayout;