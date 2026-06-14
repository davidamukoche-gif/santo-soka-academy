"use client";

import { currentUser } from "@/lib/data";
import { User, History, Download, Heart, Crown, Monitor, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      {/* Profile Card */}
      <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-2xl font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            <p className="text-sm text-[var(--muted)]">{currentUser.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                currentUser.subscription === "free"
                  ? "bg-gray-700 text-gray-300"
                  : "bg-purple-900/50 text-purple-300"
              }`}>
                {currentUser.subscription.charAt(0).toUpperCase() + currentUser.subscription.slice(1)} Plan
              </span>
              <span className="text-xs text-[var(--muted)]">
                Member since {new Date(currentUser.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/account" className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">Profile</h3>
              <p className="text-xs text-[var(--muted)]">Edit your personal info</p>
            </div>
          </div>
        </Link>

        <Link href="/account" className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">Watch History</h3>
              <p className="text-xs text-[var(--muted)]">View recently watched content</p>
            </div>
          </div>
        </Link>

        <Link href="/downloads" className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">Downloads</h3>
              <p className="text-xs text-[var(--muted)]">Manage offline downloads</p>
            </div>
          </div>
        </Link>

        <Link href="/account" className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">Favorites</h3>
              <p className="text-xs text-[var(--muted)]">Your saved content</p>
            </div>
          </div>
        </Link>

        <Link href="/plans" className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">Subscription</h3>
              <p className="text-xs text-[var(--muted)]">Manage your plan</p>
            </div>
          </div>
        </Link>

        <Link href="/account" className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">Devices</h3>
              <p className="text-xs text-[var(--muted)]">Manage connected devices</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-3">
        <button className="flex items-center gap-3 w-full bg-[var(--card)] rounded-lg p-4 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors text-left">
          <Settings className="w-5 h-5 text-[var(--muted)]" />
          <span className="text-sm">Settings</span>
        </button>
        <button className="flex items-center gap-3 w-full bg-[var(--card)] rounded-lg p-4 border border-red-500/30 hover:border-red-500/60 transition-colors text-left">
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-500">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
