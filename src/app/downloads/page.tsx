"use client";

import { useState } from "react";
import { Download, Play, Crown } from "lucide-react";
import { movies, currentUser } from "@/lib/data";
import Link from "next/link";

export default function DownloadsPage() {
  const [showAdModal, setShowAdModal] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const isPremium = currentUser.subscription !== "free";

  const handleDownload = (_movieId: string) => {
    if (isPremium) {
      alert("Download started! (Premium - instant download)");
    } else {
      setShowAdModal(true);
    }
  };

  const watchAd = () => {
    setAdWatched(true);
    setTimeout(() => {
      setShowAdModal(false);
      setAdWatched(false);
      alert("Download started after ad!");
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Download className="w-7 h-7 text-blue-500" />
        <h1 className="text-3xl font-bold">Downloads</h1>
      </div>
      <p className="text-[var(--muted)] mb-8">Download movies for offline viewing</p>

      {/* Premium Banner */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-purple-900/50 to-[var(--primary)]/30 rounded-xl p-6 mb-8 border border-purple-500/30">
          <div className="flex items-start gap-4">
            <Crown className="w-8 h-8 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1">Upgrade to Premium</h3>
              <p className="text-sm text-[var(--muted)] mb-3">
                Get unlimited HD downloads without ads. Starting at $2.99/month.
              </p>
              <Link
                href="/plans"
                className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Download Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)]">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span className="text-green-400">Free User</span>
          </h3>
          <ul className="text-sm text-[var(--muted)] space-y-1">
            <li>• Limited downloads (3/month)</li>
            <li>• Watch ad before download</li>
            <li>• Standard quality (480p)</li>
            <li>• Price: $0.20 per download</li>
          </ul>
        </div>
        <div className="bg-[var(--card)] rounded-lg p-4 border border-purple-500/30">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-purple-400">Premium User</span>
          </h3>
          <ul className="text-sm text-[var(--muted)] space-y-1">
            <li>• Unlimited downloads</li>
            <li>• Instant download (no ads)</li>
            <li>• HD quality (1080p)</li>
            <li>• Included in subscription</li>
          </ul>
        </div>
      </div>

      {/* Available Downloads */}
      <h2 className="text-xl font-bold mb-4">Available for Download</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors"
          >
            <div className="flex gap-3">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-16 h-24 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{movie.title}</h3>
                <p className="text-xs text-[var(--muted)]">{movie.year} &middot; {movie.duration}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{movie.category}</p>
                <button
                  onClick={() => handleDownload(movie.id)}
                  className="mt-2 flex items-center gap-1.5 text-xs bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-3 py-1.5 rounded transition-colors"
                >
                  <Download className="w-3 h-3" />
                  {isPremium ? "Download HD" : "Download ($0.20)"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[var(--card)] rounded-xl p-6 max-w-md w-full border border-[var(--border)]">
            {!adWatched ? (
              <>
                <h3 className="text-lg font-bold mb-2">Watch Ad to Download</h3>
                <p className="text-sm text-[var(--muted)] mb-4">
                  Free users must watch a short ad before downloading. Or upgrade to Premium for instant downloads.
                </p>
                <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Play className="w-10 h-10 text-[var(--muted)] mx-auto mb-2" />
                    <p className="text-xs text-[var(--muted)]">Ad Placeholder</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={watchAd}
                    className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2.5 rounded-lg font-semibold transition-colors"
                  >
                    Watch Ad
                  </button>
                  <button
                    onClick={() => setShowAdModal(false)}
                    className="flex-1 bg-[var(--card-hover)] text-white py-2.5 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-sm">Watching ad... Download will start shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
