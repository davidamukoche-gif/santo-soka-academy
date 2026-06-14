import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[var(--border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-[var(--primary)] mb-4">StreamX</h3>
            <p className="text-sm text-[var(--muted)]">
              Your ultimate entertainment destination. Stream movies, TV shows, and live sports.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Browse</h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/movies" className="hover:text-white transition-colors">Movies</Link></li>
              <li><Link href="/shows" className="hover:text-white transition-colors">TV Shows</Link></li>
              <li><Link href="/live" className="hover:text-white transition-colors">Live Sports</Link></li>
              <li><Link href="/downloads" className="hover:text-white transition-colors">Downloads</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/plans" className="hover:text-white transition-colors">Plans</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--border)] mt-8 pt-8 text-center text-sm text-[var(--muted)]">
          <p>&copy; 2024 StreamX Entertainment. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
