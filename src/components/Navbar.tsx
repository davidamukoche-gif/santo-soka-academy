"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, User, Bell, Download } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[var(--primary)]">StreamX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-[var(--primary)] transition-colors">
              Home
            </Link>
            <Link href="/movies" className="text-sm hover:text-[var(--primary)] transition-colors">
              Movies
            </Link>
            <Link href="/shows" className="text-sm hover:text-[var(--primary)] transition-colors">
              TV Shows
            </Link>
            <Link href="/live" className="text-sm hover:text-[var(--primary)] transition-colors">
              Live Sports
            </Link>
            <Link href="/downloads" className="text-sm hover:text-[var(--primary)] transition-colors">
              Downloads
            </Link>
          </div>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <form action="/search" method="GET" className="relative">
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-1.5 pl-9 text-sm w-48 focus:w-64 transition-all focus:outline-none focus:border-[var(--primary)]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            </form>
            <Link href="/downloads" className="hover:text-[var(--primary)] transition-colors">
              <Download className="w-5 h-5" />
            </Link>
            <button className="hover:text-[var(--primary)] transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link href="/account" className="hover:text-[var(--primary)] transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-[var(--border)]">
          <div className="px-4 py-4 space-y-3">
            <form action="/search" method="GET" className="relative mb-4">
              <input
                type="text"
                name="q"
                placeholder="Search..."
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-2 pl-9 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            </form>
            <Link href="/" className="block py-2 hover:text-[var(--primary)]" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/movies" className="block py-2 hover:text-[var(--primary)]" onClick={() => setIsMenuOpen(false)}>
              Movies
            </Link>
            <Link href="/shows" className="block py-2 hover:text-[var(--primary)]" onClick={() => setIsMenuOpen(false)}>
              TV Shows
            </Link>
            <Link href="/live" className="block py-2 hover:text-[var(--primary)]" onClick={() => setIsMenuOpen(false)}>
              Live Sports
            </Link>
            <Link href="/downloads" className="block py-2 hover:text-[var(--primary)]" onClick={() => setIsMenuOpen(false)}>
              Downloads
            </Link>
            <Link href="/account" className="block py-2 hover:text-[var(--primary)]" onClick={() => setIsMenuOpen(false)}>
              Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
