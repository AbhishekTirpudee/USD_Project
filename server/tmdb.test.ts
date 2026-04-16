import { describe, expect, it } from "vitest";
import { getTMDBClient } from "./tmdb";

describe("TMDB API Client", () => {
  const apiKey = process.env.VITE_TMDB_API_KEY;

  if (!apiKey) {
    it.skip("TMDB API key not configured", () => {
      expect(true).toBe(true);
    });
  } else {
    it("should fetch trending movies", async () => {
      const client = getTMDBClient(apiKey);
      const movies = await client.getTrendingMovies("day");

      expect(Array.isArray(movies)).toBe(true);
      expect(movies.length).toBeGreaterThan(0);

      const movie = movies[0];
      expect(movie).toHaveProperty("id");
      expect(movie).toHaveProperty("title");
      expect(movie).toHaveProperty("overview");
      expect(movie).toHaveProperty("poster_path");
    });

    it("should fetch movie genres", async () => {
      const client = getTMDBClient(apiKey);
      const genres = await client.getMovieGenres();

      expect(Array.isArray(genres)).toBe(true);
      expect(genres.length).toBeGreaterThan(0);

      const genre = genres[0];
      expect(genre).toHaveProperty("id");
      expect(genre).toHaveProperty("name");
    });

    it("should search for movies", async () => {
      const client = getTMDBClient(apiKey);
      const movies = await client.searchMovies("Inception");

      expect(Array.isArray(movies)).toBe(true);
      expect(movies.length).toBeGreaterThan(0);
    });
  }
});
