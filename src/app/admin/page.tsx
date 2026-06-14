import { Users, Film, DollarSign, TrendingUp, Crown, Eye } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Users", value: "12,458", change: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Premium Users", value: "3,892", change: "+8%", icon: Crown, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Revenue (MTD)", value: "$24,580", change: "+15%", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Active Today", value: "2,341", change: "+5%", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Manage your StreamX platform</p>
        </div>
        <Link
          href="/"
          className="text-sm text-[var(--primary)] hover:underline"
        >
          View Site
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs text-green-500 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-4">Manage</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/movies"
          className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group"
        >
          <Film className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">Movies</h3>
          <p className="text-sm text-[var(--muted)] mt-1">Add, edit, and manage movies</p>
        </Link>
        <Link
          href="/admin/users"
          className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group"
        >
          <Users className="w-8 h-8 text-green-500 mb-3" />
          <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">Users</h3>
          <p className="text-sm text-[var(--muted)] mt-1">View and manage users</p>
        </Link>
        <Link
          href="/admin/ads"
          className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group"
        >
          <Eye className="w-8 h-8 text-yellow-500 mb-3" />
          <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">Advertisements</h3>
          <p className="text-sm text-[var(--muted)] mt-1">Manage ads and revenue</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left text-xs font-medium text-[var(--muted)] p-4">Event</th>
              <th className="text-left text-xs font-medium text-[var(--muted)] p-4 hidden sm:table-cell">User</th>
              <th className="text-left text-xs font-medium text-[var(--muted)] p-4">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]">
              <td className="p-4 text-sm">New subscription (Pro)</td>
              <td className="p-4 text-sm text-[var(--muted)] hidden sm:table-cell">john@email.com</td>
              <td className="p-4 text-sm text-[var(--muted)]">2 min ago</td>
            </tr>
            <tr className="border-b border-[var(--border)]">
              <td className="p-4 text-sm">Movie downloaded</td>
              <td className="p-4 text-sm text-[var(--muted)] hidden sm:table-cell">sarah@email.com</td>
              <td className="p-4 text-sm text-[var(--muted)]">5 min ago</td>
            </tr>
            <tr className="border-b border-[var(--border)]">
              <td className="p-4 text-sm">New user registered</td>
              <td className="p-4 text-sm text-[var(--muted)] hidden sm:table-cell">mike@email.com</td>
              <td className="p-4 text-sm text-[var(--muted)]">12 min ago</td>
            </tr>
            <tr>
              <td className="p-4 text-sm">Payment received ($5.99)</td>
              <td className="p-4 text-sm text-[var(--muted)] hidden sm:table-cell">alice@email.com</td>
              <td className="p-4 text-sm text-[var(--muted)]">18 min ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
