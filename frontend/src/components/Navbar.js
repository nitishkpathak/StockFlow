import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  getCompanyName,
  isAdmin,
  logoutUser,
} from "../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const user = getCurrentUser();
  const companyName = getCompanyName();

  // Logout user
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Toggle dark/light mode
  const toggleTheme = () => {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"
          />
        </svg>
      ),
    },

    {
      name: "Products",
      path: "/products",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M4.5 7.5L12 12l7.5-4.5M12 12v9"
          />
        </svg>
      ),
    },

    {
      name: "Categories",
      path: "/categories",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M5 7h14M5 12h14M5 17h14"
          />
          <circle cx="8" cy="7" r="1" fill="currentColor" />
          <circle cx="16" cy="12" r="1" fill="currentColor" />
          <circle cx="10" cy="17" r="1" fill="currentColor" />
        </svg>
      ),
    },

    {
      name: "Suppliers",
      path: "/suppliers",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M4 20h16M6 20V8h12v12M9 8V5h6v3M9 12h2M13 12h2M9 16h2M13 16h2"
          />
        </svg>
      ),
    },

    {
      name: "Stock History",
      path: "/stock-history",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M12 6v6l4 2"
          />
          <circle
            cx="12"
            cy="12"
            r="8.5"
            strokeWidth="1.8"
          />
        </svg>
      ),
    },

    {
      name: "Reports",
      path: "/reports",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M5 19V9M12 19V5M19 19v-7"
          />
        </svg>
      ),
    },
  ];

  // Users menu only for ADMIN
  if (isAdmin()) {
    navItems.push({
      name: "Users",
      path: "/users",
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
          />
          <circle
            cx="9"
            cy="7"
            r="4"
            strokeWidth="1.8"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          />
        </svg>
      ),
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">

      {/* =====================================================
          DESKTOP NAVBAR
      ====================================================== */}
      <div className="mx-auto hidden h-[72px] max-w-[1440px] items-center px-5 xl:flex 2xl:px-8">

        {/* Logo */}
        <div
          className="flex w-[195px] shrink-0 cursor-pointer items-center gap-3"
          onClick={() => navigate("/dashboard")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-md shadow-blue-200 dark:shadow-none">
            S
          </div>

          <div>
            <h1 className="text-[17px] font-bold leading-5 tracking-tight text-slate-900 dark:text-white">
              StockFlow
            </h1>

            <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Inventory Management
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex min-w-0 flex-1 items-center justify-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-[12px] font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="ml-3 flex shrink-0 items-center gap-2">

          {/* Divider */}
          <div className="mr-1 h-8 w-px bg-slate-200 dark:bg-slate-800" />

          {/* User + Company */}
          <div className="flex items-center gap-2.5">

            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* User Information */}
            <div className="hidden xl:block min-w-0">

              {/* User Name */}
              <p className="max-w-[105px] truncate text-[12px] font-semibold leading-4 text-slate-800 dark:text-slate-100">
                {user?.name || "User"}
              </p>

              {/* Company Name */}
              <p className="max-w-[120px] truncate text-[10px] font-medium leading-4 text-blue-600 dark:text-blue-400">
                {companyName || "Company"}
              </p>

              {/* Role */}
              <span
                className={`inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-semibold leading-3 ${
                  user?.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {user?.role || "STAFF"}
              </span>
            </div>
          </div>

          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            title={darkMode ? "Light mode" : "Dark mode"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {darkMode ? (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
                <path
                  strokeLinecap="round"
                  strokeWidth="1.8"
                  d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M21 12.8A8.5 8.5 0 1111.2 3a6.7 6.7 0 009.8 9.8z"
                />
              </svg>
            )}
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 text-[12px] font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 00-2-2h-6"
              />
            </svg>

            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET NAVBAR
      ====================================================== */}
      <div className="flex h-16 items-center justify-between px-4 xl:hidden">

        {/* Logo */}
        <div
          className="flex cursor-pointer items-center gap-2.5"
          onClick={() => navigate("/dashboard")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-sm">
            S
          </div>

          <div>
            <h1 className="text-[16px] font-bold text-slate-900 dark:text-white">
              StockFlow
            </h1>

            <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Inventory
            </p>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2">

          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            {darkMode ? "☀" : "☾"}
          </button>

          {/* Menu */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            {isMenuOpen ? (
              <span className="text-xl">×</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 dark:border-slate-800 dark:bg-slate-950 xl:hidden">

          {/* User Information */}
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">

            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* Details */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.name || "User"}
              </p>

              <p className="max-w-[220px] truncate text-xs font-medium text-blue-600 dark:text-blue-400">
                {companyName || "Company"}
              </p>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {user?.role || "STAFF"}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 00-2-2h-6"
              />
            </svg>

            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;