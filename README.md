# StreamX Entertainment Platform

A web entertainment platform where users discover, stream, and download content with revenue through subscriptions, ads, and premium features.

## Features

### User-Facing
- **Home Screen** — Trending, New Movies, TV Shows, Live Sports sections
- **Movie System** — Movie pages with poster, description, genre, rating, trailer, watch & download
- **TV Shows** — Seasons, episodes, auto-next-episode support
- **Live Sports** — Live match scores, schedule, watch button
- **Download System** — Ad-gated for free users, instant for premium
- **Search** — Search across movies and shows by title, genre, category
- **User Accounts** — Profile, watch history, downloads, favorites, subscription, devices
- **Subscription Plans** — Free, Basic ($2.99), Pro ($5.99), Family ($9.99)

### Admin Dashboard
- Movie management (add, edit, delete)
- User management with subscription stats
- Advertisement management with revenue tracking
- Platform analytics (users, revenue, engagement)

### Monetization
- Banner & video advertisements for free users
- Premium subscriptions (Basic/Pro/Family)
- Pay-per-download ($0.20 per movie)
- Stripe & M-Pesa payment support

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Icons**: Lucide React
- **Styling**: CSS Variables + Tailwind
- **Backend** (planned): Node.js, Express, PostgreSQL
- **Payments** (planned): Stripe, M-Pesa
- **Mobile** (planned): React Native

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Home page
│   ├── movies/           # Movie catalog & detail pages
│   ├── shows/            # TV shows & detail pages
│   ├── live/             # Live sports
│   ├── downloads/        # Download center
│   ├── plans/            # Subscription plans
│   ├── search/           # Search results
│   ├── account/          # User dashboard
│   ├── auth/             # Login & Register
│   └── admin/            # Admin dashboard
├── components/           # Shared UI components
├── lib/                  # Data & utilities
└── types/                # TypeScript types
```

## Database Schema (Planned)

- **Users** — id, name, email, password, subscription, created_at
- **Movies** — id, title, description, poster, category, rating
- **Downloads** — id, user_id, movie_id, date, payment
- **Subscriptions** — user_id, plan, expiry, status
- **Payments** — id, user, amount, method, status

## MVP Roadmap

### Phase 1 (Current)
- Website with responsive UI
- User accounts (login/register)
- Movie & TV show catalog
- Search functionality
- Ad placements
- Premium subscription plans

### Phase 2
- Mobile app (React Native)
- Download with payments
- Push notifications

### Phase 3
- Live sports streaming
- Smart TV support
- AI recommendations
