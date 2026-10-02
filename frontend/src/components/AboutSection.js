function AboutSection() {
  const highlights = [
    {
      icon: "📦",
      title: "Centralized Management",
      description: "Manage your inventory from one place.",
    },
    {
      icon: "🔐",
      title: "Secure Access",
      description: "Control access with user roles.",
    },
    {
      icon: "📊",
      title: "Real-time Tracking",
      description: "Keep track of stock movement.",
    },
    {
      icon: "📈",
      title: "Clear Insights",
      description: "Understand inventory through reports.",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-slate-50 px-6 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl"></div>

      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl">

        {/* Main Content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left Content */}
          <div>

            <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
              About StockFlow
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Stay in Control
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              StockFlow is an inventory management system designed to help
              businesses organize products, suppliers, categories, and
              stock operations from one centralized platform.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              From daily stock management to reports and analytics,
              StockFlow brings essential inventory operations together
              in a simple and easy-to-use system.
            </p>

            {/* Highlights */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg">
                      {item.icon}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

            </div>

          </div>

          {/* Right Visual */}
          <div className="relative">

            {/* Glow */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl"></div>

            <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl"></div>

            {/* Main Card */}
            <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-6">

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    StockFlow
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-800">
                    Inventory Overview
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-200">
                  S
                </div>

              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs text-slate-500">
                    Products
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-600">
                    248
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Total products
                  </p>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <p className="text-xs text-slate-500">
                    In Stock
                  </p>

                  <p className="mt-2 text-2xl font-bold text-green-600">
                    1,842
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Available items
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-xs text-slate-500">
                    Low Stock
                  </p>

                  <p className="mt-2 text-2xl font-bold text-orange-500">
                    12
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Need attention
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                  <p className="text-xs text-slate-500">
                    Suppliers
                  </p>

                  <p className="mt-2 text-2xl font-bold text-purple-600">
                    36
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Business partners
                  </p>
                </div>

              </div>

              {/* Progress */}
              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Inventory Health
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Current stock status
                    </p>
                  </div>

                  <span className="text-sm font-bold text-green-600">
                    92%
                  </span>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Healthy inventory</span>
                  <span>92 / 100</span>
                </div>

              </div>

              {/* Status */}
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-green-100 bg-green-50 px-4 py-3">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                    ✓
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Inventory is being tracked
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      All systems are working normally
                    </p>
                  </div>

                </div>

                <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AboutSection;