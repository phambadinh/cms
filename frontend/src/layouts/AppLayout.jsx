import { Outlet } from "react-router-dom";
import Header from "../components/Header";
<<<<<<< HEAD
import Sidebar from "../components/Sidebar";
=======
import Footer from "../components/Footer";
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683
import ChatWidget from "../components/chat/ChatWidget";
import "../styles/app-layout.css";

function AppLayout() {
  return (
    <div className="app-layout-shell">
<<<<<<< HEAD
      <Sidebar />

      <div className="app-layout-body">
        <Header />

        <main className="app-layout-main">
          <Outlet />
        </main>
      </div>
=======
      <Header />

      <main className="app-layout-main">
        <Outlet />
      </main>

      <Footer />
>>>>>>> 951bef6c76ec00b1328bd7cc87e68eeb7fb23683

      {/* Chatbox hỗ trợ nổi - hiển thị trên mọi trang cho user đã đăng nhập */}
      <ChatWidget />
    </div>
  );
}

export default AppLayout;