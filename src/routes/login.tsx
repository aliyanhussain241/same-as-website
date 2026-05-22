import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      navigate({ to: "/resume" });
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/resume` },
    });
    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({ text: "Account created! Please check your email to confirm.", type: "success" });
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({ text: "Password reset email sent! Check your inbox.", type: "success" });
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    setMessage({
      text: error.message,
      type: "error",
    });
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/">
            <img src="/ai-resumi.webp" alt="airesumi" className="h-10 mx-auto mb-2" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {tab === "login" && "Welcome Back"}
            {tab === "signup" && "Create Account"}
            {tab === "forgot" && "Reset Password"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {tab === "login" && "Sign in to your airesumi account"}
            {tab === "signup" && "Start building your perfect resume"}
            {tab === "forgot" && "We'll send you a reset link"}
          </p>
        </div>

        {/* Tabs */}
        {tab !== "forgot" && (
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setTab("login"); setMessage(null); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                tab === "login" ? "bg-white shadow text-orange-600" : "text-gray-500"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setTab("signup"); setMessage(null); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                tab === "signup" ? "bg-white shadow text-orange-600" : "text-gray-500"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Google Button */}
        {tab !== "forgot" && (
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition mb-4"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Continue with Google
          </button>
        )}

        {/* Divider */}
        {tab !== "forgot" && (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${
            message.type === "error"
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-green-50 text-green-600 border border-green-200"
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={tab === "login" ? handleLogin : tab === "signup" ? handleSignup : handleForgot}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {tab !== "forgot" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          {tab === "login" && (
            <div className="text-right mb-4">
              <button
                type="button"
                onClick={() => { setTab("forgot"); setMessage(null); }}
                className="text-sm text-orange-500 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : tab === "login" ? "Sign In" : tab === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login */}
        {tab === "forgot" && (
          <button
            onClick={() => { setTab("login"); setMessage(null); }}
            className="w-full text-center text-sm text-gray-500 hover:text-orange-500 mt-4"
          >
            ← Back to Login
          </button>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-orange-500 hover:underline">Terms</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
