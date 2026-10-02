"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Radio, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push("/discover");
    router.refresh();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !displayName.trim()) {
      setError("Username and display name are required.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.trim(), display_name: displayName.trim() },
      },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess("Account created! Check your email to confirm, then sign in.");
    setTab("signin");
  };

  const inputClass =
    "w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-echo focus:border-transparent";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-echo flex items-center justify-center text-white font-bold text-xl mb-3">
            E
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Echo</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Find your people. Join the conversation.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          {/* Tabs */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 mb-6">
            {["signin", "signup"].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-echo text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-400">
              {success}
            </div>
          )}

          {/* Sign In Form */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="signin-email" type="email" required placeholder="Email" value={email}
                  onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="signin-password" type={showPassword ? "text" : "password"} required
                  placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg bg-echo text-white text-sm font-semibold hover:bg-echo/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {tab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="signup-displayname" type="text" required placeholder="Display name"
                  value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                <input id="signup-username" type="text" required placeholder="Username"
                  value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                  className={inputClass} autoComplete="username" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="signup-email" type="email" required placeholder="Email"
                  value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="signup-password" type={showPassword ? "text" : "password"} required
                  placeholder="Password (min 6 chars)" value={password} minLength={6}
                  onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-10`} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg bg-echo text-white text-sm font-semibold hover:bg-echo/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to Echo&apos;s community guidelines.
        </p>
      </div>
    </div>
  );
}
