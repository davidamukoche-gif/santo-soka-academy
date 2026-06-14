import { ArrowLeft, Crown } from "lucide-react";
import Link from "next/link";

const users = [
  { id: "1", name: "John Doe", email: "john@email.com", subscription: "pro", joined: "2024-01-15", status: "active" },
  { id: "2", name: "Sarah Smith", email: "sarah@email.com", subscription: "basic", joined: "2024-02-20", status: "active" },
  { id: "3", name: "Mike Johnson", email: "mike@email.com", subscription: "free", joined: "2024-03-01", status: "active" },
  { id: "4", name: "Alice Brown", email: "alice@email.com", subscription: "family", joined: "2024-01-10", status: "active" },
  { id: "5", name: "David Otieno", email: "david@email.com", subscription: "pro", joined: "2024-02-28", status: "active" },
  { id: "6", name: "Grace Mwangi", email: "grace@email.com", subscription: "free", joined: "2024-03-10", status: "inactive" },
];

export default function AdminUsersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)]">
          <p className="text-2xl font-bold">12,458</p>
          <p className="text-xs text-[var(--muted)]">Total Users</p>
        </div>
        <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)]">
          <p className="text-2xl font-bold">3,892</p>
          <p className="text-xs text-[var(--muted)]">Premium Users</p>
        </div>
        <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)]">
          <p className="text-2xl font-bold">$23.4K</p>
          <p className="text-xs text-[var(--muted)]">Monthly Revenue</p>
        </div>
        <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)]">
          <p className="text-2xl font-bold">2,341</p>
          <p className="text-xs text-[var(--muted)]">Active Today</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-xs font-medium text-[var(--muted)] p-4">User</th>
                <th className="text-left text-xs font-medium text-[var(--muted)] p-4 hidden sm:table-cell">Plan</th>
                <th className="text-left text-xs font-medium text-[var(--muted)] p-4 hidden md:table-cell">Joined</th>
                <th className="text-left text-xs font-medium text-[var(--muted)] p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-[var(--muted)]">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                      user.subscription === "free"
                        ? "bg-gray-700 text-gray-300"
                        : user.subscription === "family"
                        ? "bg-yellow-900/50 text-yellow-300"
                        : "bg-purple-900/50 text-purple-300"
                    }`}>
                      {user.subscription !== "free" && <Crown className="w-3 h-3" />}
                      {user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[var(--muted)] hidden md:table-cell">
                    {new Date(user.joined).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.status === "active"
                        ? "bg-green-900/50 text-green-300"
                        : "bg-red-900/50 text-red-300"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
