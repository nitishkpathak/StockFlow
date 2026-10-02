import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"></div>

      <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl"></div>

      {/* Hero Container */}
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-10 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:py-14">

        {/* ================= LEFT CONTENT ================= */}
        <div className="max-w-xl">

          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
            Smart Inventory Management
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[54px]">
            Manage Your Inventory
            <span className="mt-1 block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smarter. Faster. Better.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            StockFlow gives your business one simple platform to manage
            products, track stock, organize suppliers, and understand
            your inventory with powerful analytics.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap gap-3">

            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Get Started

              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <a
              href="#features"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              Explore Features
            </a>

          </div>

          {/* Trust Points */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 sm:text-sm">

            <span className="flex items-center gap-1.5">
              <span className="font-bold text-green-500">✓</span>
              Easy to use
            </span>

            <span className="flex items-center gap-1.5">
              <span className="font-bold text-green-500">✓</span>
              Secure access
            </span>

            <span className="flex items-center gap-1.5">
              <span className="font-bold text-green-500">✓</span>
              Real-time tracking
            </span>

          </div>

          {/* Stats */}
          <div className="mt-7 flex max-w-lg border-t border-slate-200 pt-5">

            <div className="flex-1">
              <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                100%
              </p>

              <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                Inventory Control
              </p>
            </div>

            <div className="border-l border-slate-200 pl-5 sm:pl-8">
              <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                24/7
              </p>

              <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                Access
              </p>
            </div>

            <div className="border-l border-slate-200 pl-5 sm:pl-8">
              <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                Secure
              </p>

              <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                Authentication
              </p>
            </div>

          </div>

        </div>

        {/* ================= RIGHT DASHBOARD ================= */}
        <div className="relative lg:pl-2">

          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-blue-200/40 blur-2xl"></div>

          <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-indigo-200/40 blur-2xl"></div>

          {/* Dashboard Window */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-2.5 shadow-2xl shadow-slate-200/70">

            {/* Browser Header */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">

              <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>

              <div className="ml-2 h-6 flex-1 rounded-md bg-slate-100"></div>

            </div>

            {/* Dashboard Body */}
            <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">

              {/* Dashboard Heading */}
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-medium text-slate-400 sm:text-xs">
                    StockFlow Dashboard
                  </p>

                  <h3 className="mt-0.5 text-lg font-bold text-slate-800 sm:text-xl">
                    Inventory Overview
                  </h3>
                </div>

                <div className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-[10px] font-semibold text-white sm:text-xs">
                  Live
                </div>

              </div>

              {/* Stats Cards */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">

                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                  <p className="text-[10px] text-slate-400">
                    Products
                  </p>

                  <p className="mt-1 text-base font-bold text-slate-800 sm:text-lg">
                    248
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                  <p className="text-[10px] text-slate-400">
                    Stock
                  </p>

                  <p className="mt-1 text-base font-bold text-slate-800 sm:text-lg">
                    1,842
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                  <p className="text-[10px] text-slate-400">
                    Low Stock
                  </p>

                  <p className="mt-1 text-base font-bold text-orange-500 sm:text-lg">
                    12
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                  <p className="text-[10px] text-slate-400">
                    Suppliers
                  </p>

                  <p className="mt-1 text-base font-bold text-slate-800 sm:text-lg">
                    36
                  </p>
                </div>

              </div>

              {/* Stock Movement */}
              <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                      Stock Movement
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
                      Inventory activity
                    </p>
                  </div>

                  <span className="rounded-md bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">
                    +18.5%
                  </span>

                </div>

                {/* Chart */}
                <div className="mt-4 flex h-24 items-end gap-2 sm:h-28 sm:gap-2.5">

                  <div className="h-[35%] flex-1 rounded-t-md bg-blue-200"></div>

                  <div className="h-[55%] flex-1 rounded-t-md bg-blue-300"></div>

                  <div className="h-[45%] flex-1 rounded-t-md bg-blue-300"></div>

                  <div className="h-[72%] flex-1 rounded-t-md bg-blue-400"></div>

                  <div className="h-[58%] flex-1 rounded-t-md bg-blue-400"></div>

                  <div className="h-[90%] flex-1 rounded-t-md bg-blue-600"></div>

                  <div className="h-[70%] flex-1 rounded-t-md bg-blue-500"></div>

                </div>

              </div>

              {/* Recent Activity */}
              <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">

                <div className="flex items-center justify-between">

                  <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                    Recent Activity
                  </p>

                  <span className="text-[10px] font-medium text-blue-600 sm:text-xs">
                    View all
                  </span>

                </div>

                <div className="mt-3 space-y-2.5">

                  {/* Activity 1 */}
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2.5">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-sm font-bold text-green-600">
                        ↑
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold text-slate-700 sm:text-xs">
                          Stock Added
                        </p>

                        <p className="text-[9px] text-slate-400 sm:text-[10px]">
                          Dell Laptop
                        </p>
                      </div>

                    </div>

                    <span className="text-[10px] font-bold text-green-600 sm:text-xs">
                      +25
                    </span>

                  </div>

                  {/* Activity 2 */}
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2.5">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-sm font-bold text-red-500">
                        ↓
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold text-slate-700 sm:text-xs">
                          Stock Removed
                        </p>

                        <p className="text-[9px] text-slate-400 sm:text-[10px]">
                          Wireless Mouse
                        </p>
                      </div>

                    </div>

                    <span className="text-[10px] font-bold text-red-500 sm:text-xs">
                      -10
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Floating Notification */}
          <div className="absolute -bottom-4 -left-3 hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-xl sm:block">

            <div className="flex items-center gap-2.5">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-sm font-bold text-green-600">
                ✓
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-800">
                  Inventory Updated
                </p>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Stock data is up to date
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;