import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      <Navbar />

      <main className="min-h-[calc(100vh-72px)]">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;