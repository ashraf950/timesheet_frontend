import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

export default function LoginPage({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function validate() {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // If parent passes an onSubmit, call it (useful for real auth)
      if (onSubmit) await onSubmit({ email, password });
      else {
        // Mock delay to simulate network
        await new Promise((r) => setTimeout(r, 800));
        alert("Logged in (mock)");
      }
    } catch (err) {
      setErrors({ form: err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8"
      >
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to continue to your account</p>
        </header>

        {errors.form && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label className="block mb-3">
            <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Mail size={16} /> Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-2 block w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                errors.email ? "border-red-300" : "border-slate-200"
              }`}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Lock size={16} /> Password
            </span>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full rounded-lg border px-4 py-3 pr-28 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                  errors.password ? "border-red-300" : "border-slate-200"
                }`}
                placeholder="Your secure password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200"
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </label>

          <div className="flex items-center justify-between mb-6">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="rounded border-slate-300"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-slate-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 disabled:opacity-60 transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">or continue with</div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="py-2 rounded-lg border flex items-center justify-center gap-2 font-medium">
            Continue with Google
          </button>
          <button className="py-2 rounded-lg border flex items-center justify-center gap-2 font-medium">
            Continue with GitHub
          </button>
        </div>

        <footer className="mt-6 text-center text-sm text-slate-600">
          Don\'t have an account? <a href="#" className="text-indigo-600 font-medium">Sign up</a>
        </footer>
      </motion.div>
    </div>
  );
}