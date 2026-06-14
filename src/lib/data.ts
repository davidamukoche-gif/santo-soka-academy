import { Movie, TVShow, LiveMatch, Advertisement } from "@/types";

export const movies: Movie[] = [
  {
    id: "1",
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    category: "Action",
    genre: ["Action", "Crime", "Drama"],
    year: 2008,
    rating: 9.0,
    duration: "2h 32min",
    isTrending: true,
  },
  {
    id: "2",
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    category: "Sci-Fi",
    genre: ["Action", "Adventure", "Sci-Fi"],
    year: 2010,
    rating: 8.8,
    duration: "2h 28min",
    isTrending: true,
  },
  {
    id: "3",
    title: "Interstellar",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
    category: "Sci-Fi",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    year: 2014,
    rating: 8.6,
    duration: "2h 49min",
    isNew: true,
  },
  {
    id: "4",
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    category: "Drama",
    genre: ["Drama"],
    year: 1994,
    rating: 9.3,
    duration: "2h 22min",
    isTrending: true,
  },
  {
    id: "5",
    title: "Parasite",
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    category: "Thriller",
    genre: ["Comedy", "Drama", "Thriller"],
    year: 2019,
    rating: 8.5,
    duration: "2h 12min",
    isNew: true,
  },
  {
    id: "6",
    title: "Avengers: Endgame",
    description:
      "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop",
    category: "Action",
    genre: ["Action", "Adventure", "Drama"],
    year: 2019,
    rating: 8.4,
    duration: "3h 1min",
    isTrending: true,
  },
  {
    id: "7",
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop",
    category: "Sci-Fi",
    genre: ["Action", "Adventure", "Sci-Fi"],
    year: 2024,
    rating: 8.7,
    duration: "2h 46min",
    isNew: true,
    isTrending: true,
  },
  {
    id: "8",
    title: "Oppenheimer",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
    category: "Drama",
    genre: ["Biography", "Drama", "History"],
    year: 2023,
    rating: 8.3,
    duration: "3h 0min",
    isNew: true,
  },
];

export const tvShows: TVShow[] = [
  {
    id: "1",
    title: "Money Heist",
    description:
      "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ced95?w=400&h=600&fit=crop",
    category: "Crime",
    genre: ["Action", "Crime", "Mystery"],
    year: 2017,
    rating: 8.2,
    seasons: [
      {
        number: 1,
        episodes: [
          { id: "s1e1", number: 1, title: "Episode 1: Efectuar lo acordado", duration: "47min" },
          { id: "s1e2", number: 2, title: "Episode 2: Imprudencias letales", duration: "45min" },
          { id: "s1e3", number: 3, title: "Episode 3: Errar al disparar", duration: "43min" },
          { id: "s1e4", number: 4, title: "Episode 4: Boda inminente", duration: "48min" },
          { id: "s1e5", number: 5, title: "Episode 5: El Día de la Marmota", duration: "44min" },
        ],
      },
      {
        number: 2,
        episodes: [
          { id: "s2e1", number: 1, title: "Episode 1: Se acabaron las máscaras", duration: "52min" },
          { id: "s2e2", number: 2, title: "Episode 2: El Patio de los Leones", duration: "49min" },
          { id: "s2e3", number: 3, title: "Episode 3: 48 metros bajo tierra", duration: "46min" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Breaking Bad",
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
    poster: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=600&fit=crop",
    category: "Drama",
    genre: ["Crime", "Drama", "Thriller"],
    year: 2008,
    rating: 9.5,
    seasons: [
      {
        number: 1,
        episodes: [
          { id: "bb-s1e1", number: 1, title: "Pilot", duration: "58min" },
          { id: "bb-s1e2", number: 2, title: "Cat's in the Bag...", duration: "48min" },
          { id: "bb-s1e3", number: 3, title: "...And the Bag's in the River", duration: "48min" },
          { id: "bb-s1e4", number: 4, title: "Cancer Man", duration: "48min" },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Stranger Things",
    description:
      "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces.",
    poster: "https://images.unsplash.com/photo-1626278664285-f796b9ee7806?w=400&h=600&fit=crop",
    category: "Sci-Fi",
    genre: ["Drama", "Fantasy", "Horror"],
    year: 2016,
    rating: 8.7,
    seasons: [
      {
        number: 1,
        episodes: [
          { id: "st-s1e1", number: 1, title: "Chapter One: The Vanishing of Will Byers", duration: "47min" },
          { id: "st-s1e2", number: 2, title: "Chapter Two: The Weirdo on Maple Street", duration: "55min" },
          { id: "st-s1e3", number: 3, title: "Chapter Three: Holly, Jolly", duration: "51min" },
        ],
      },
    ],
  },
];

export const liveMatches: LiveMatch[] = [
  {
    id: "1",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    competition: "Premier League",
    startTime: "2024-03-15T20:00:00Z",
    isLive: true,
    homeScore: 1,
    awayScore: 2,
  },
  {
    id: "2",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    competition: "La Liga",
    startTime: "2024-03-16T21:00:00Z",
    isLive: true,
    homeScore: 0,
    awayScore: 0,
  },
  {
    id: "3",
    homeTeam: "Bayern Munich",
    awayTeam: "Dortmund",
    competition: "Bundesliga",
    startTime: "2024-03-17T17:30:00Z",
    isLive: false,
  },
  {
    id: "4",
    homeTeam: "PSG",
    awayTeam: "Marseille",
    competition: "Ligue 1",
    startTime: "2024-03-17T20:45:00Z",
    isLive: false,
  },
];

export const advertisements: Advertisement[] = [
  {
    id: "1",
    title: "StreamX Premium - 50% Off",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=200&fit=crop",
    targetUrl: "/plans",
    type: "banner",
    clicks: 1250,
    impressions: 45000,
    revenue: 125.0,
  },
  {
    id: "2",
    title: "New Movie Release",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=200&fit=crop",
    targetUrl: "/movies/7",
    type: "banner",
    clicks: 890,
    impressions: 32000,
    revenue: 89.0,
  },
];

export const currentUser: {
  id: string;
  name: string;
  email: string;
  subscription: "free" | "basic" | "pro" | "family";
  createdAt: string;
  avatar?: string;
} = {
  id: "1",
  name: "Demo User",
  email: "demo@streamx.com",
  subscription: "free",
  createdAt: "2024-01-15",
};
