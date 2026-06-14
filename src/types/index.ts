export interface User {
  id: string;
  name: string;
  email: string;
  subscription: "free" | "basic" | "pro" | "family";
  createdAt: string;
  avatar?: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  poster: string;
  trailer?: string;
  category: string;
  genre: string[];
  year: number;
  rating: number;
  duration: string;
  isTrending?: boolean;
  isNew?: boolean;
}

export interface TVShow {
  id: string;
  title: string;
  description: string;
  poster: string;
  category: string;
  genre: string[];
  year: number;
  rating: number;
  seasons: Season[];
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  thumbnail?: string;
}

export interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  startTime: string;
  isLive: boolean;
  homeScore?: number;
  awayScore?: number;
  homeLogo?: string;
  awayLogo?: string;
}

export interface Download {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  date: string;
  payment?: number;
  status: "completed" | "pending" | "failed";
}

export interface Subscription {
  userId: string;
  plan: "free" | "basic" | "pro" | "family";
  expiry: string;
  status: "active" | "expired" | "cancelled";
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: "stripe" | "mpesa";
  status: "completed" | "pending" | "failed";
  date: string;
}

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  type: "banner" | "video" | "popup";
  clicks: number;
  impressions: number;
  revenue: number;
}
