import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function MainLayout() {
  return (
    <div>
      <header>
        <h1>My Blog</h1>
        {/* ✅ Use the same name you imported */}
        <Navbar />
      </header>

      <main>
        {/* ✅ This is where child routes render */}
        <Outlet />
      </main>
    </div>
  );
}