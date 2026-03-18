import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function MainLayout() {
  return (
    <div>
      <header>
        <h1>My Blog</h1>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}