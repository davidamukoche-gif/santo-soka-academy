import { movies } from "@/lib/data";
import MovieCard from "@/components/MovieCard";

export default function MoviesPage() {
  const categories = [...new Set(movies.map((m) => m.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Movies</h1>
      <p className="text-[var(--muted)] mb-8">Browse our collection of movies</p>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-full text-sm font-medium whitespace-nowrap">
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 bg-[var(--card)] text-white rounded-full text-sm font-medium hover:bg-[var(--card-hover)] transition-colors whitespace-nowrap"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
