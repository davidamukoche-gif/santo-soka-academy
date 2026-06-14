import Link from "next/link";
import { Star } from "lucide-react";
import { Movie } from "@/types";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="group flex-shrink-0 w-44 sm:w-52">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-[var(--card)]">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 text-[var(--accent)]">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs">{movie.rating}</span>
          </div>
        </div>
        {movie.isTrending && (
          <span className="absolute top-2 left-2 bg-[var(--primary)] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            Trending
          </span>
        )}
        {movie.isNew && !movie.isTrending && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            New
          </span>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium truncate">{movie.title}</h3>
      <p className="text-xs text-[var(--muted)]">{movie.year} &middot; {movie.category}</p>
    </Link>
  );
}
