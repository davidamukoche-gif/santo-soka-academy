"use client";

import { use, useState } from "react";
import { tvShows } from "@/lib/data";
import { Star, Play, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const show = tvShows.find((s) => s.id === id);
  const [selectedSeason, setSelectedSeason] = useState(0);

  if (!show) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Show Not Found</h1>
        <Link href="/shows" className="text-[var(--primary)] hover:underline">
          Back to Shows
        </Link>
      </div>
    );
  }

  const currentSeason = show.seasons[selectedSeason];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[40vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent z-10" />
        <img
          src={show.poster}
          alt={show.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <Link href="/shows" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Shows
        </Link>

        <div className="flex flex-col sm:flex-row gap-8 mb-8">
          <img
            src={show.poster}
            alt={show.title}
            className="w-40 sm:w-56 rounded-xl shadow-2xl flex-shrink-0"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{show.title}</h1>
            <div className="flex items-center gap-4 mb-4 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1 text-[var(--accent)]">
                <Star className="w-4 h-4 fill-current" /> {show.rating}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {show.year}
              </span>
              <span>{show.seasons.length} Season{show.seasons.length > 1 ? "s" : ""}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {show.genre.map((g) => (
                <span key={g} className="px-3 py-1 bg-[var(--card)] rounded-full text-xs">
                  {g}
                </span>
              ))}
            </div>
            <p className="text-[var(--muted)] max-w-2xl leading-relaxed">{show.description}</p>
          </div>
        </div>

        {/* Season Selector */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {show.seasons.map((season, idx) => (
              <button
                key={season.number}
                onClick={() => setSelectedSeason(idx)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedSeason === idx
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--card)] text-white hover:bg-[var(--card-hover)]"
                }`}
              >
                Season {season.number}
              </button>
            ))}
          </div>
        </div>

        {/* Episodes */}
        <div className="space-y-3 mb-16">
          {currentSeason?.episodes.map((episode) => (
            <div
              key={episode.id}
              className="flex items-center gap-4 bg-[var(--card)] rounded-lg p-4 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 bg-[var(--background)] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary)] transition-colors">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{episode.title}</h4>
                <p className="text-xs text-[var(--muted)]">Episode {episode.number}</p>
              </div>
              <span className="text-xs text-[var(--muted)] flex-shrink-0">{episode.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
