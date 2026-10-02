import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-20 sm:py-24">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl"></div>

      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-200/50 blur-3xl"></div>

      {/* Main CTA Card */}
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 px-6 py-14 shadow-2xl shadow-blue-200/60 sm:px-10 sm:py-16 lg:px-16">

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10"></div>

        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/10"></div>

        <div className="pointer-events-none absolute right-20 top-10 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>

        {/* Content */}
        <div className="relative mx-auto max-w-3xl text-center">

          {/* Badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-50 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-green-300"></span>
            Ready to Get Started?
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Take Control of Your
            <span className="block text-blue-100">
              Inventory Today
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base sm:leading-7">
            Manage products, track stock, organize suppliers, and understand
            your inventory with one simple and powerful platform.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Get Started Free
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            >
              Already have an account?
            </Link>

          </div>

          {/* Trust Points */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-blue-100 sm:text-sm">

            <span className="flex items-center gap-1.5">
              <span className="font-bold text-green-300">✓</span>
              Easy setup
            </span>

            <span className="flex items-center gap-1.5">
              <span className="font-bold text-green-300">✓</span>
              Secure authentication
            </span>

            <span className="flex items-center gap-1.5">
              <span className="font-bold text-green-300">✓</span>
              Role-based access
            </span>

          </div>

        </div>
      </div>
    </section>
  );
}

export default CTASection;