function FeaturesSection() {
  const features = [
    {
      icon: "📦",
      title: "Product Management",
      description:
        "Manage products, prices, quantities, categories, and suppliers from one centralized platform.",
    },
    {
      icon: "📊",
      title: "Stock Tracking",
      description:
        "Monitor stock levels and track every stock-in and stock-out movement with ease.",
    },
    {
      icon: "🚚",
      title: "Supplier Management",
      description:
        "Keep supplier details organized and quickly access the information your business needs.",
    },
    {
      icon: "📈",
      title: "Reports & Analytics",
      description:
        "Get clear insights into inventory, stock movement, low-stock items, and overall performance.",
    },
    {
      icon: "👥",
      title: "Role Based Access",
      description:
        "Give your team the right level of access with secure ADMIN and STAFF roles.",
    },
    {
      icon: "🔐",
      title: "Secure Authentication",
      description:
        "Protect your inventory system with secure login, password encryption, and controlled access.",
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-slate-50 px-6 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl"></div>

      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            Powerful Features
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Manage Your Inventory
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            From products and suppliers to stock tracking and analytics,
            StockFlow brings your essential inventory operations together
            in one simple platform.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
            >

              {/* Top gradient line */}
              <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-300 group-hover:scale-x-100"></div>

              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition duration-300 group-hover:scale-110 group-hover:bg-blue-100">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="mt-5 text-lg font-bold text-slate-800">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

        {/* Bottom Highlight */}
        <div className="mt-10 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                ⚡
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 sm:text-base">
                  Everything connected in one place
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Manage your complete inventory workflow without
                  switching between multiple tools.
                </p>
              </div>

            </div>

            <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-green-600">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
              System Ready
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;