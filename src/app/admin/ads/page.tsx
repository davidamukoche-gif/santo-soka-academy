"use client";

import { useState } from "react";
import { advertisements } from "@/lib/data";
import { Plus, ArrowLeft, Eye, MousePointer, DollarSign } from "lucide-react";
import Link from "next/link";

export default function AdminAdsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const totalRevenue = advertisements.reduce((sum, ad) => sum + ad.revenue, 0);
  const totalClicks = advertisements.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalImpressions = advertisements.reduce((sum, ad) => sum + ad.impressions, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Advertisements</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Ad
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)] flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-xl font-bold">${totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-[var(--muted)]">Total Revenue</p>
          </div>
        </div>
        <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)] flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <MousePointer className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xl font-bold">{totalClicks.toLocaleString()}</p>
            <p className="text-xs text-[var(--muted)]">Total Clicks</p>
          </div>
        </div>
        <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)] flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-xl font-bold">{totalImpressions.toLocaleString()}</p>
            <p className="text-xs text-[var(--muted)]">Impressions</p>
          </div>
        </div>
      </div>

      {/* Add Ad Form */}
      {showAddForm && (
        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-lg font-bold mb-4">Add New Advertisement</h3>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Ad Title</label>
              <input
                type="text"
                placeholder="Ad title"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Type</label>
              <select className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]">
                <option>Banner</option>
                <option>Video</option>
                <option>Popup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Target URL</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="button"
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Save Ad
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-[var(--card-hover)] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ads List */}
      <div className="space-y-4">
        {advertisements.map((ad) => (
          <div key={ad.id} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">{ad.title}</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Type: {ad.type} &middot; Target: {ad.targetUrl}</p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold">{ad.clicks.toLocaleString()}</p>
                  <p className="text-xs text-[var(--muted)]">Clicks</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{ad.impressions.toLocaleString()}</p>
                  <p className="text-xs text-[var(--muted)]">Views</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-green-500">${ad.revenue.toFixed(2)}</p>
                  <p className="text-xs text-[var(--muted)]">Revenue</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
