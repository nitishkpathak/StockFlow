function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "👤",
      title: "Create Your Account",
      description:
        "Create your StockFlow account and set up your company workspace in just a few steps.",
    },
    {
      number: "02",
      icon: "📦",
      title: "Add Your Inventory",
      description:
        "Add products, categories, suppliers, prices, quantities, and other important details.",
    },
    {
      number: "03",
      icon: "📊",
      title: "Track Your Stock",
      description:
        "Monitor inventory levels and record stock movement to keep your data up to date.",
    },
    {
      number: "04",
      icon: "📈",
      title: "Analyze & Manage",
      description:
        "Use dashboards and reports to understand your inventory and manage your business better.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white px-6 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl"></div>

      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            How It Works
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Start Managing Your Inventory
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              In Four Simple Steps
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Get your inventory organized and under control with a simple
            workflow designed for modern businesses.
          </p>

        </div>

        {/* Desktop Timeline */}
        <div className="relative mt-16 hidden lg:block">

          {/* Connecting Line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-7 h-px bg-slate-200"></div>

          <div className="grid grid-cols-4 gap-8">

            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative text-center"
              >

                {/* Number Circle */}
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200 transition duration-300 group-hover:scale-110 group-hover:bg-indigo-600">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-2xl transition duration-300 group-hover:border-blue-200 group-hover:bg-blue-50">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
                  {step.description}
                </p>

              </div>
            ))}

          </div>
        </div>

        {/* Mobile / Tablet Steps */}
        <div className="relative mt-12 lg:hidden">

          {/* Vertical Line */}
          <div className="absolute bottom-8 left-7 top-8 w-px bg-slate-200"></div>

          <div className="space-y-8">

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex gap-5"
              >

                {/* Number */}
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-100">
                  {step.number}
                </div>

                {/* Card */}
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-md">

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      {step.icon}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {step.description}
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        </div>

        {/* Bottom Highlight */}
        <div className="mt-14 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">

          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
              🚀
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 sm:text-base">
                Everything is designed to stay simple
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                From setup to daily inventory management, StockFlow keeps
                your workflow organized and easy to understand.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;