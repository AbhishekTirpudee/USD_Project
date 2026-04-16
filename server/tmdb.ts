import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
}

export interface TMDBShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: TMDBGenre[];
  runtime: number;
  status: string;
  revenue: number;
  budget: number;
}

export interface TMDBShowDetails extends TMDBShow {
  genres: TMDBGenre[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
}

class TMDBClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, params: Record<string, unknown> = {}) {
    try {
      if (this.apiKey.includes("your_tmdb")) throw new Error("Dummy API Key");
      const response = await axios.get<T>(`${TMDB_BASE_URL}${endpoint}`, {
        params: {
          api_key: this.apiKey,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.warn(`[TMDB Fallback] Returning fake data for ${endpoint}`);
      return this.getFakeData(endpoint) as T;
    }
  }

  private getFakeData(endpoint: string) {
    const fakeMovies = [
      {
        id: 101,
        title: "Cyberpunk: Edgerunners Retro",
        overview: "In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become an edgerunner.",
        poster_path: "/posters/cyberpunk_poster_1776279053152.png",
        backdrop_path: "/posters/cyberpunk_poster_1776279053152.png",
        release_date: "2026-01-01",
        vote_average: 9.5,
        genre_ids: [28, 878],
        popularity: 1000
      },
      {
        id: 102,
        title: "The Silent Sea Awakening",
        overview: "During a perilous 24-hour mission on the moon, space explorers try to retrieve samples from an abandoned research facility steeped in classified secrets.",
        poster_path: "/posters/silent_sea_poster_1776279076785.png",
        backdrop_path: "/posters/silent_sea_poster_1776279076785.png",
        release_date: "2025-12-15",
        vote_average: 8.2,
        genre_ids: [18, 9648],
        popularity: 850
      },
      {
        id: 103,
        title: "Stranger Things: The Final Chapter",
        overview: "The Hawkins crew returns for one last battle against the Upside Down.",
        poster_path: "/posters/stranger_things_poster_1776279101400.png",
        backdrop_path: "/posters/stranger_things_poster_1776279101400.png",
        release_date: "2026-07-04",
        vote_average: 8.9,
        genre_ids: [18, 14],
        popularity: 1200
      },
      {
        id: 104,
        title: "Dune: Part Three (Visions)",
        overview: "Paul Atreides wages a holy war across the universe.",
        poster_path: "/posters/dune_poster_1776279120451.png",
        backdrop_path: "/posters/dune_poster_1776279120451.png",
        release_date: "2027-03-12",
        vote_average: 9.1,
        genre_ids: [28, 12, 878],
        popularity: 1500
      },
      {
        id: 105,
        title: "Inception 2: Dreamscape",
        overview: "A new team of extractors must dive deeper into the subconscious than ever before.",
        poster_path: "/posters/inception_poster_1776279140858.png",
        backdrop_path: "/posters/inception_poster_1776279140858.png",
        release_date: "2028-11-20",
        vote_average: 8.5,
        genre_ids: [28, 878, 53],
        popularity: 950
      },
      {
        id: 106,
        title: "Neon Horizons",
        overview: "Flying cars over a sprawling rainy metropolis at night.",
        poster_path: "/posters/neon_horizons_poster_1776279543508.png",
        backdrop_path: "/posters/neon_horizons_poster_1776279543508.png",
        release_date: "2025-05-18",
        vote_average: 8.0,
        genre_ids: [878, 28],
        popularity: 800
      },
      {
        id: 107,
        title: "The Haunting of Blackwood",
        overview: "A spooky old mansion in the deep fog.",
        poster_path: "/posters/haunting_blackwood_poster_1776279562314.png",
        backdrop_path: "/posters/haunting_blackwood_poster_1776279562314.png",
        release_date: "2024-10-31",
        vote_average: 7.8,
        genre_ids: [27, 9648],
        popularity: 700
      },
      {
        id: 108,
        title: "Galactic Vanguard",
        overview: "Giant spaceships in an intense space battle, lots of explosions and stars.",
        poster_path: "/posters/galactic_vanguard_poster_1776279581955.png",
        backdrop_path: "/posters/galactic_vanguard_poster_1776279581955.png",
        release_date: "2026-11-10",
        vote_average: 8.6,
        genre_ids: [878, 12, 28],
        popularity: 1100
      },
      {
        id: 109,
        title: "Echoes in the Ice",
        overview: "A lone climber traversing a massive glowing glacier underneath the aurora borealis.",
        poster_path: "/posters/echoes_ice_poster_1776279600257.png",
        backdrop_path: "/posters/echoes_ice_poster_1776279600257.png",
        release_date: "2023-12-05",
        vote_average: 8.3,
        genre_ids: [53, 12],
        popularity: 650
      },
      {
        id: 110,
        title: "Legends of the Lost Kingdom",
        overview: "A brave knight standing before a massive glowing golden castle.",
        poster_path: "/posters/lost_kingdom_poster_1776279617972.png",
        backdrop_path: "/posters/lost_kingdom_poster_1776279617972.png",
        release_date: "2027-04-14",
        vote_average: 9.0,
        genre_ids: [14, 28, 12],
        popularity: 1300
      }
    ];

    if (endpoint.includes("/genre/")) {
      return { genres: [{ id: 28, name: "Action" }, { id: 878, name: "Sci-Fi" }, { id: 18, name: "Drama" }] };
    }

    if (endpoint.includes("/tv") || endpoint.includes("tv")) {
      const fakeShows = fakeMovies.map(m => ({
        ...m,
        id: m.id + 1000,
        name: m.title.replace("Movie", "Show"),
        first_air_date: m.release_date,
        number_of_seasons: 1,
        number_of_episodes: 10,
        status: "Returning Series"
      }));
      // If it's a detail request, return single show
      if (endpoint.match(/\/tv\/\d+/)) {
        return { ...fakeShows[0], genres: [{ id: 28, name: "Action" }] };
      }
      return { results: fakeShows };
    }

    // Default to movies
    if (endpoint.match(/\/movie\/\d+/)) {
      return { ...fakeMovies[0], genres: [{ id: 28, name: "Action" }], runtime: 120, status: "Released", revenue: 1000000, budget: 500000 };
    }
    return { results: fakeMovies };
  }

  async getTrendingMovies(timeWindow: "day" | "week" = "day") {
    const data = await this.request<{ results: TMDBMovie[] }>(
      `/trending/movie/${timeWindow}`
    );
    return data.results;
  }

  async getTrendingShows(timeWindow: "day" | "week" = "day") {
    const data = await this.request<{ results: TMDBShow[] }>(
      `/trending/tv/${timeWindow}`
    );
    return data.results;
  }

  async getMoviesByGenre(genreId: number, page: number = 1) {
    const data = await this.request<{ results: TMDBMovie[] }>(
      "/discover/movie",
      {
        with_genres: genreId,
        page,
      }
    );
    return data.results;
  }

  async getShowsByGenre(genreId: number, page: number = 1) {
    const data = await this.request<{ results: TMDBShow[] }>(
      "/discover/tv",
      {
        with_genres: genreId,
        page,
      }
    );
    return data.results;
  }

  async searchMovies(query: string, page: number = 1) {
    const data = await this.request<{ results: TMDBMovie[] }>(
      "/search/movie",
      {
        query,
        page,
      }
    );
    return data.results;
  }

  async searchShows(query: string, page: number = 1) {
    const data = await this.request<{ results: TMDBShow[] }>(
      "/search/tv",
      {
        query,
        page,
      }
    );
    return data.results;
  }

  async getMovieDetails(movieId: number) {
    const data = await this.request<TMDBMovieDetails>(
      `/movie/${movieId}`
    );
    return data;
  }

  async getShowDetails(showId: number) {
    const data = await this.request<TMDBShowDetails>(
      `/tv/${showId}`
    );
    return data;
  }

  async getMovieGenres() {
    const data = await this.request<{ genres: TMDBGenre[] }>(
      "/genre/movie/list"
    );
    return data.genres;
  }

  async getShowGenres() {
    const data = await this.request<{ genres: TMDBGenre[] }>(
      "/genre/tv/list"
    );
    return data.genres;
  }
}

export function getTMDBClient(apiKey: string) {
  return new TMDBClient(apiKey);
}
