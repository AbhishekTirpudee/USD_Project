import { eq, and } from "drizzle-orm";
import { watchlist, continueWatching, InsertWatchlist, InsertContinueWatching } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Watchlist helpers
 */
export async function addToWatchlist(data: InsertWatchlist) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(watchlist).values(data);
}

export async function removeFromWatchlist(userId: number, tmdbId: number, mediaType: "movie" | "tv") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(watchlist)
    .where(
      and(
        eq(watchlist.userId, userId),
        eq(watchlist.tmdbId, tmdbId),
        eq(watchlist.mediaType, mediaType)
      )
    );
}

export async function getWatchlist(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(watchlist).where(eq(watchlist.userId, userId));
}

export async function isInWatchlist(userId: number, tmdbId: number, mediaType: "movie" | "tv") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(watchlist)
    .where(
      and(
        eq(watchlist.userId, userId),
        eq(watchlist.tmdbId, tmdbId),
        eq(watchlist.mediaType, mediaType)
      )
    )
    .limit(1);

  return result.length > 0;
}

/**
 * Continue watching helpers
 */
export async function addToContinueWatching(data: InsertContinueWatching) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(continueWatching)
    .where(
      and(
        eq(continueWatching.userId, data.userId),
        eq(continueWatching.tmdbId, data.tmdbId),
        eq(continueWatching.mediaType, data.mediaType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing record
    await db
      .update(continueWatching)
      .set({
        progress: data.progress,
        lastWatchedAt: new Date(),
      })
      .where(eq(continueWatching.id, existing[0].id));
  } else {
    // Insert new record
    await db.insert(continueWatching).values(data);
  }
}

export async function getContinueWatching(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(continueWatching)
    .where(eq(continueWatching.userId, userId));
}

export async function removeFromContinueWatching(userId: number, tmdbId: number, mediaType: "movie" | "tv") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(continueWatching)
    .where(
      and(
        eq(continueWatching.userId, userId),
        eq(continueWatching.tmdbId, tmdbId),
        eq(continueWatching.mediaType, mediaType)
      )
    );
}
