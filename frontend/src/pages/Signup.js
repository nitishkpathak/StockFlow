import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../services/apiConfig";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    const companyName = formData.companyName.trim();
    const companyEmail = formData.companyEmail.trim().toLowerCase();
    const companyPhone = formData.companyPhone.trim();
    const companyAddress = formData.companyAddress.trim();

    // Check empty fields
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !companyName ||
      !companyEmail ||
      !companyPhone ||
      !companyAddress
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate user name
    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    // Validate user email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate company email
    if (!emailRegex.test(companyEmail)) {
      setError("Please enter a valid company email address.");
      return;
    }

    // Validate company name
    if (companyName.length < 2) {
      setError("Company name must contain at least 2 characters.");
      return;
    }

    // Validate company phone
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(companyPhone)) {
      setError("Company phone must contain exactly 10 digits.");
      return;
    }

    // Validate password
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/auth/register`,
        {
          name,
          email,
          password,
          companyName,
          companyEmail,
          companyPhone,
          companyAddress,
        }
      );

      setSuccess(
        "Company and admin account created successfully. Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        companyEmail: "",
        companyPhone: "",
        companyAddress: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error("Signup error:", err);

      if (err.response?.status === 409) {
        setError("This email is already registered.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (!err.response) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message ||
              "Unable to create account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 dark:bg-slate-950">

      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-7 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-blue-200 dark:shadow-none">
            S
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            StockFlow
          </h1>

          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Inventory Management
          </p>

        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">

          {/* Heading */}
          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Create your company
            </h2>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Create your StockFlow company and admin account.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400"
            >

              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold dark:bg-red-900/50">
                !
              </div>

              <p className="leading-5">
                {error}
              </p>

            </div>
          )}

          {/* Success */}
          {success && (
            <div
              role="status"
              className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-400"
            >

              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold dark:bg-green-900/50">
                ✓
              </div>

              <p className="leading-5">
                {success}
              </p>

            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Admin Name */}
            <div className="mb-4">

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Admin full name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:disabled:bg-slate-900"
              />

            </div>

            {/* Admin Email */}
            <div className="mb-4">

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Admin email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:disabled:bg-slate-900"
              />

            </div>

            {/* Company Name */}
            <div className="mb-4">

              <label
                htmlFor="companyName"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Company name
              </label>

              <input
                id="companyName"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:disabled:bg-slate-900"
              />

            </div>

            {/* Company Email */}
            <div className="mb-4">

              <label
                htmlFor="companyEmail"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Company email
              </label>

              <input
                id="companyEmail"
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="company@example.com"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:disabled:bg-slate-900"
              />

            </div>

            {/* Company Phone */}
            <div className="mb-4">

              <label
                htmlFor="companyPhone"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Company phone
              </label>

              <input
                id="companyPhone"
                type="tel"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                placeholder="Enter 10 digit phone number"
                maxLength="10"
                inputMode="numeric"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:disabled:bg-slate-900"
              />

            </div>

            {/* Company Address */}
            <div className="mb-4">

              <label
                htmlFor="companyAddress"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Company address
              </label>

              <textarea
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Enter company address"
                rows="2"
                disabled={loading}
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:disabled:bg-slate-900"
              />

            </div>

            {/* Password */}
            <div className="mb-4">

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:disabled:bg-slate-900"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>

              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Password must contain at least 6 characters.
              </p>

            </div>

            {/* Confirm Password */}
            <div className="mb-6">

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirm password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:disabled:bg-slate-900"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? "◉" : "◌"}
                </button>

              </div>

            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>

                  Creating company...
                </>
              ) : (
                <>
                  Create Company

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
                      d="M5 12h14M13 6l6 6-6 6"
                    />
                  </svg>
                </>
              )}

            </button>

          </form>

          {/* Login Link */}
          <div className="mt-6 border-t border-slate-200 pt-5 text-center dark:border-slate-800">

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>

            </p>

          </div>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          StockFlow Inventory Management System
        </p>

      </div>

    </div>
  );
}

export default Signup;