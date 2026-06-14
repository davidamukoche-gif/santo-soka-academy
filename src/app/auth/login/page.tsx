"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login functionality will be connected to backend API");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--primary)]">StreamX</h1>
            <p className="text-sm text-[var(--muted)] mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-[var(--muted)]">Remember me</span>
              </label>
              <a href="#" className="text-[var(--primary)] hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[var(--primary)] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
