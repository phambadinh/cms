import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function AppLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
      }}
    >
      <Navbar />
      <Header />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default AppLayout;