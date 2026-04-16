import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getTMDBClient } from "./tmdb";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  isInWatchlist,
  addToContinueWatching,
  getContinueWatching,
  removeFromContinueWatching,
} from "./db-helpers";

// Get TMDB API key from environment
const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY || "";

export const contentRouter = router({
  /**
   * Movies and Shows
   */
  trending: router({
    movies: publicProcedure
      .input(z.object({ timeWindow: z.enum(["day", "week"]).default("day") }))
      .query(async ({ input }) => {
        if (!TMDB_API_KEY) {
          return [];
        }
        try {
          const client = getTMDBClient(TMDB_API_KEY);
          return await client.getTrendingMovies(input.timeWindow);
        } catch (error) {
          console.error("Error fetching trending movies:", error);
          return [];
        }
      }),

    shows: publicProcedure
      .input(z.object({ timeWindow: z.enum(["day", "week"]).default("day") }))
      .query(async ({ input }) => {
        if (!TMDB_API_KEY) {
          return [];
        }
        try {
          const client = getTMDBClient(TMDB_API_KEY);
          return await client.getTrendingShows(input.timeWindow);
        } catch (error) {
          console.error("Error fetching trending shows:", error);
          return [];
        }
      }),
  }),

  genres: router({
    movies: publicProcedure.query(async () => {
      if (!TMDB_API_KEY) {
        return [];
      }
      try {
        const client = getTMDBClient(TMDB_API_KEY);
        return await client.getMovieGenres();
      } catch (error) {
        console.error("Error fetching movie genres:", error);
        return [];
      }
    }),

    shows: publicProcedure.query(async () => {
      if (!TMDB_API_KEY) {
        return [];
      }
      try {
        const client = getTMDBClient(TMDB_API_KEY);
        return await client.getShowGenres();
      } catch (error) {
        console.error("Error fetching show genres:", error);
        return [];
      }
    }),
  }),

  byGenre: router({
    movies: publicProcedure
      .input(z.object({ genreId: z.number(), page: z.number().default(1) }))
      .query(async ({ input }) => {
        if (!TMDB_API_KEY) {
          return [];
        }
        try {
          const client = getTMDBClient(TMDB_API_KEY);
          return await client.getMoviesByGenre(input.genreId, input.page);
        } catch (error) {
          console.error("Error fetching movies by genre:", error);
          return [];
        }
      }),

    shows: publicProcedure
      .input(z.object({ genreId: z.number(), page: z.number().default(1) }))
      .query(async ({ input }) => {
        if (!TMDB_API_KEY) {
          return [];
        }
        try {
          const client = getTMDBClient(TMDB_API_KEY);
          return await client.getShowsByGenre(input.genreId, input.page);
        } catch (error) {
          console.error("Error fetching shows by genre:", error);
          return [];
        }
      }),
  }),

  search: router({
    movies: publicProcedure
      .input(z.object({ query: z.string(), page: z.number().default(1) }))
      .query(async ({ input }) => {
        if (!TMDB_API_KEY || !input.query) {
          return [];
        }
        try {
          const client = getTMDBClient(TMDB_API_KEY);
          return await client.searchMovies(input.query, input.page);
        } catch (error) {
          console.error("Error searching movies:", error);
          return [];
        }
      }),

    shows: publicProcedure
      .input(z.object({ query: z.string(), page: z.number().default(1) }))
      .query(async ({ input }) => {
        if (!TMDB_API_KEY || !input.query) {
          return [];
        }
        try {
          const client = getTMDBClient(TMDB_API_KEY);
          return await client.searchShows(input.query, input.page);
        } catch (error) {
          console.error("Error searching shows:", error);
          return [];
        }
      }),
  }),

  details: router({
    movie: publicProcedure
      .input(z.object({ movieId: z.number() }))
      .query(async ({ input }) => {
        if (!TMDB_API_KEY) {
          return null;
        }
        try {
          const client = getTMDBClient(TMDB_API_KEY);
          return await client.getMovieDetails(input.movieId);
        } catch (error) {
          console.error("Error fetching movie details:", error);
          return null;
        }
      }),

    show: publicProcedure
      .input(z.object({ showId: z.number() }))
      .query(async ({ input }) => {
        if (!TMDB_API_KEY) {
          return null;
        }
        try {
          const client = getTMDBClient(TMDB_API_KEY);
          return await client.getShowDetails(input.showId);
        } catch (error) {
          console.error("Error fetching show details:", error);
          return null;
        }
      }),
  }),

  /**
   * Watchlist
   */
  watchlist: router({
    add: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
          title: z.string(),
          posterPath: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await addToWatchlist({
          userId: ctx.user.id,
          tmdbId: input.tmdbId,
          mediaType: input.mediaType,
          title: input.title,
          posterPath: input.posterPath,
        });
        return { success: true };
      }),

    remove: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await removeFromWatchlist(ctx.user.id, input.tmdbId, input.mediaType);
        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getWatchlist(ctx.user.id);
    }),

    isInWatchlist: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
        })
      )
      .query(async ({ ctx, input }) => {
        return await isInWatchlist(ctx.user.id, input.tmdbId, input.mediaType);
      }),
  }),

  /**
   * Continue Watching
   */
  continueWatching: router({
    add: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
          title: z.string(),
          posterPath: z.string().optional(),
          progress: z.number().default(0),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await addToContinueWatching({
          userId: ctx.user.id,
          tmdbId: input.tmdbId,
          mediaType: input.mediaType,
          title: input.title,
          posterPath: input.posterPath,
          progress: input.progress,
        });
        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getContinueWatching(ctx.user.id);
    }),

    remove: protectedProcedure
      .input(
        z.object({
          tmdbId: z.number(),
          mediaType: z.enum(["movie", "tv"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await removeFromContinueWatching(ctx.user.id, input.tmdbId, input.mediaType);
        return { success: true };
      }),
  }),
});
