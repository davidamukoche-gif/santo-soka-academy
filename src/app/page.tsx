import { Flame, Film, Tv, Trophy, Play } from "lucide-react";
import { movies, tvShows, liveMatches } from "@/lib/data";
import MovieCard from "@/components/MovieCard";
import ContentRow from "@/components/ContentRow";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export default function Home() {
  const trendingMovies = movies.filter((m) => m.isTrending);
  const newMovies = movies.filter((m) => m.isNew);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden mb-10 h-[400px] sm:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop"
          alt="Featured"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-end p-8 sm:p-12">
          <span className="text-[var(--primary)] text-sm font-semibold mb-2">Featured</span>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3">Dune: Part Two</h1>
          <p className="text-[var(--muted)] max-w-lg mb-6 text-sm sm:text-base">
            Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.
          </p>
          <div className="flex gap-3">
            <Link
              href="/movies/7"
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Now
            </Link>
            <Link
              href="/movies/7"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              More Info
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <AdBanner />

      {/* Trending */}
      <ContentRow title="Trending Now" icon={<Flame className="w-5 h-5 text-orange-500" />} href="/movies">
        {trendingMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ContentRow>

      {/* New Movies */}
      <ContentRow title="New Movies" icon={<Film className="w-5 h-5 text-blue-500" />} href="/movies">
        {newMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ContentRow>

      {/* TV Shows */}
      <ContentRow title="TV Shows" icon={<Tv className="w-5 h-5 text-green-500" />} href="/shows">
        {tvShows.map((show) => (
          <Link key={show.id} href={`/shows/${show.id}`} className="group flex-shrink-0 w-44 sm:w-52">
            <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-[var(--card)]">
              <img
                src={show.poster}
                alt={show.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="mt-2 text-sm font-medium truncate">{show.title}</h3>
            <p className="text-xs text-[var(--muted)]">{show.seasons.length} Seasons</p>
          </Link>
        ))}
      </ContentRow>

      {/* Live Sports */}
      <ContentRow title="Live Sports" icon={<Trophy className="w-5 h-5 text-yellow-500" />} href="/live">
        {liveMatches.map((match) => (
          <div key={match.id} className="flex-shrink-0 w-72 bg-[var(--card)] rounded-lg p-4 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--muted)]">{match.competition}</span>
              {match.isLive && (
                <span className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-sm font-medium">{match.homeTeam}</p>
                {match.isLive && <p className="text-2xl font-bold mt-1">{match.homeScore}</p>}
              </div>
              <span className="text-[var(--muted)] text-sm mx-3">vs</span>
              <div className="text-center flex-1">
                <p className="text-sm font-medium">{match.awayTeam}</p>
                {match.isLive && <p className="text-2xl font-bold mt-1">{match.awayScore}</p>}
              </div>
            </div>
            {!match.isLive && (
              <p className="text-xs text-[var(--muted)] mt-3 text-center">
                {new Date(match.startTime).toLocaleDateString()} at{" "}
                {new Date(match.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
            <Link
              href="/live"
              className="mt-3 w-full block text-center bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm py-2 rounded-lg transition-colors"
            >
              {match.isLive ? "Watch Now" : "Set Reminder"}
            </Link>
          </div>
        ))}
      </ContentRow>
    </div>
  );
}
