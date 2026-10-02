import { Link } from "react-router-dom";

function LandingFooter() {
  return (
    <footer className="bg-slate-950 px-6 py-14">
      <div className="mx-auto max-w-7xl">

        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">

            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-900/30">
                S
              </div>

              <span className="text-xl font-bold text-white">
                Stock<span className="text-blue-400">Flow</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              A simple and powerful inventory management system designed
              to help businesses manage products, stock, suppliers, users,
              and reports from one centralized platform.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Smart Inventory Management
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <a
                href="#features"
                className="w-fit text-sm text-slate-400 transition hover:text-blue-400"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="w-fit text-sm text-slate-400 transition hover:text-blue-400"
              >
                How It Works
              </a>

              <a
                href="#about"
                className="w-fit text-sm text-slate-400 transition hover:text-blue-400"
              >
                About
              </a>

            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Account
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                to="/login"
                className="w-fit text-sm text-slate-400 transition hover:text-blue-400"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="w-fit text-sm text-slate-400 transition hover:text-blue-400"
              >
                Create Account
              </Link>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="my-10 border-t border-slate-800"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} StockFlow. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span>Built for smarter</span>
            <span className="font-medium text-slate-400">
              inventory management
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default LandingFooter;