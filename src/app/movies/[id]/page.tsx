"use client";

import { use } from "react";
import { movies } from "@/lib/data";
import { Star, Play, Download, Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
        <Link href="/movies" className="text-[var(--primary)] hover:underline">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Background */}
      <div className="relative h-[50vh] sm:h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent z-10" />
        <img
          src={movie.poster}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-64">
        <Link href="/movies" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Movies
        </Link>

        <div className="flex flex-col sm:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-48 sm:w-64 rounded-xl shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{movie.title}</h1>

            <div className="flex items-center gap-4 mb-4 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1 text-[var(--accent)]">
                <Star className="w-4 h-4 fill-current" /> {movie.rating}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {movie.year}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {movie.duration}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map((g) => (
                <span key={g} className="px-3 py-1 bg-[var(--card)] rounded-full text-xs">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-[var(--muted)] mb-6 max-w-2xl leading-relaxed">
              {movie.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                <Play className="w-5 h-5 fill-current" /> Watch Now
              </button>
              <Link
                href="/downloads"
                className="bg-[var(--card)] hover:bg-[var(--card-hover)] text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors border border-[var(--border)]"
              >
                <Download className="w-5 h-5" /> Download
              </Link>
            </div>

            {/* Trailer Placeholder */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Trailer</h3>
              <div className="bg-[var(--card)] rounded-xl aspect-video max-w-lg flex items-center justify-center border border-[var(--border)]">
                <div className="text-center">
                  <Play className="w-12 h-12 text-[var(--muted)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--muted)]">Trailer Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
