import { Outlet } from "react-router-dom";
import Header from "../components/Header";
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
      <Header />

      <main style={{ flex: 1, width: "100%" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default AppLayout;