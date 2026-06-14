"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { movies, tvShows } from "@/lib/data";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";
import { Search, Star } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase()) ||
      m.genre.some((g) => g.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredShows = tvShows.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase()) ||
      s.genre.some((g) => g.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Search className="w-7 h-7 text-[var(--primary)]" />
        <h1 className="text-3xl font-bold">Search</h1>
      </div>

      {query ? (
        <p className="text-[var(--muted)] mb-8">
          Results for &quot;{query}&quot; ({filteredMovies.length + filteredShows.length} found)
        </p>
      ) : (
        <p className="text-[var(--muted)] mb-8">Enter a search term to find movies and shows</p>
      )}

      {/* Search Input */}
      <form action="/search" method="GET" className="mb-8">
        <div className="relative max-w-xl">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search movies, shows, genres..."
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-5 py-3.5 pl-12 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
        </div>
      </form>

      {query && (
        <>
          {/* Movies Results */}
          {filteredMovies.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {/* Shows Results */}
          {filteredShows.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">TV Shows</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredShows.map((show) => (
                  <Link key={show.id} href={`/shows/${show.id}`} className="group">
                    <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-[var(--card)]">
                      <img
                        src={show.poster}
                        alt={show.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[var(--accent)]">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs">{show.rating}</span>
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-medium truncate">{show.title}</h3>
                    <p className="text-xs text-[var(--muted)]">{show.seasons.length} Seasons</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {filteredMovies.length === 0 && filteredShows.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-[var(--muted)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-sm text-[var(--muted)]">
                Try searching with different keywords
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
