import { liveMatches } from "@/lib/data";
import { Trophy, Bell } from "lucide-react";

export default function LiveSportsPage() {
  const liveGames = liveMatches.filter((m) => m.isLive);
  const upcoming = liveMatches.filter((m) => !m.isLive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Trophy className="w-7 h-7 text-yellow-500" />
        <h1 className="text-3xl font-bold">Live Sports</h1>
      </div>
      <p className="text-[var(--muted)] mb-8">Watch live matches and upcoming fixtures</p>

      {/* Live Now */}
      {liveGames.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            Live Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveGames.map((match) => (
              <div
                key={match.id}
                className="bg-[var(--card)] rounded-xl p-6 border border-red-500/30 hover:border-red-500/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[var(--muted)]">{match.competition}</span>
                  <span className="flex items-center gap-1.5 text-sm text-red-500 font-bold">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-[var(--background)] rounded-full mx-auto mb-2 flex items-center justify-center text-lg">
                      {match.homeTeam.charAt(0)}
                    </div>
                    <p className="font-medium text-sm">{match.homeTeam}</p>
                    <p className="text-3xl font-bold mt-2">{match.homeScore}</p>
                  </div>
                  <div className="text-2xl font-bold text-[var(--muted)] mx-4">-</div>
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-[var(--background)] rounded-full mx-auto mb-2 flex items-center justify-center text-lg">
                      {match.awayTeam.charAt(0)}
                    </div>
                    <p className="font-medium text-sm">{match.awayTeam}</p>
                    <p className="text-3xl font-bold mt-2">{match.awayScore}</p>
                  </div>
                </div>
                <button className="mt-6 w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3 rounded-lg font-semibold transition-colors">
                  Watch Live
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section>
        <h2 className="text-xl font-bold mb-4">Upcoming Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcoming.map((match) => (
            <div
              key={match.id}
              className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[var(--muted)]">{match.competition}</span>
                <span className="text-xs text-[var(--muted)]">
                  {new Date(match.startTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-10 h-10 bg-[var(--background)] rounded-full mx-auto mb-2 flex items-center justify-center">
                    {match.homeTeam.charAt(0)}
                  </div>
                  <p className="font-medium text-sm">{match.homeTeam}</p>
                </div>
                <div className="text-center mx-4">
                  <p className="text-sm text-[var(--muted)]">
                    {new Date(match.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-center flex-1">
                  <div className="w-10 h-10 bg-[var(--background)] rounded-full mx-auto mb-2 flex items-center justify-center">
                    {match.awayTeam.charAt(0)}
                  </div>
                  <p className="font-medium text-sm">{match.awayTeam}</p>
                </div>
              </div>
              <button className="mt-4 w-full bg-[var(--card-hover)] hover:bg-[var(--border)] text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                <Bell className="w-4 h-4" /> Set Reminder
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
