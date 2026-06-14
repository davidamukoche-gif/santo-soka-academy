import { tvShows } from "@/lib/data";
import Link from "next/link";
import { Star } from "lucide-react";

export default function ShowsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">TV Shows</h1>
      <p className="text-[var(--muted)] mb-8">Binge-worthy series and shows</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {tvShows.map((show) => (
          <Link key={show.id} href={`/shows/${show.id}`} className="group">
            <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-[var(--card)]">
              <img
                src={show.poster}
                alt={show.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1 text-[var(--accent)]">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs">{show.rating}</span>
                </div>
              </div>
            </div>
            <h3 className="mt-2 text-sm font-medium truncate">{show.title}</h3>
            <p className="text-xs text-[var(--muted)]">
              {show.seasons.length} Season{show.seasons.length > 1 ? "s" : ""} &middot; {show.year}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
