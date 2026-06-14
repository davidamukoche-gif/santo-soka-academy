"use client";

import { useState } from "react";
import { movies } from "@/lib/data";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminMoviesPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Movies</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Movie
        </button>
      </div>

      {/* Add Movie Form */}
      {showAddForm && (
        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] mb-6">
          <h3 className="text-lg font-bold mb-4">Add New Movie</h3>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title</label>
              <input
                type="text"
                placeholder="Movie title"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]">
                <option>Action</option>
                <option>Drama</option>
                <option>Sci-Fi</option>
                <option>Comedy</option>
                <option>Thriller</option>
                <option>Horror</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                rows={3}
                placeholder="Movie description..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Poster URL</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Trailer URL</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Year</label>
              <input
                type="number"
                placeholder="2024"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Rating</label>
              <input
                type="number"
                step="0.1"
                max="10"
                placeholder="8.5"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="button"
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Save Movie
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

      {/* Movies Table */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-xs font-medium text-[var(--muted)] p-4">Movie</th>
                <th className="text-left text-xs font-medium text-[var(--muted)] p-4 hidden sm:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-[var(--muted)] p-4 hidden md:table-cell">Year</th>
                <th className="text-left text-xs font-medium text-[var(--muted)] p-4">Rating</th>
                <th className="text-right text-xs font-medium text-[var(--muted)] p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={movie.poster} alt={movie.title} className="w-10 h-14 rounded object-cover" />
                      <span className="text-sm font-medium">{movie.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--muted)] hidden sm:table-cell">{movie.category}</td>
                  <td className="p-4 text-sm text-[var(--muted)] hidden md:table-cell">{movie.year}</td>
                  <td className="p-4 text-sm">{movie.rating}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-[var(--card-hover)] rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-2 hover:bg-[var(--card-hover)] rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
