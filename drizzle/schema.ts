import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Watchlist table for storing user's saved movies and shows
 */
export const watchlist = mysqlTable("watchlist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tmdbId: int("tmdbId").notNull(),
  mediaType: mysqlEnum("mediaType", ["movie", "tv"]).notNull(),
  title: text("title").notNull(),
  posterPath: varchar("posterPath", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Watchlist = typeof watchlist.$inferSelect;
export type InsertWatchlist = typeof watchlist.$inferInsert;

/**
 * Continue watching table for tracking user's viewing progress
 */
export const continueWatching = mysqlTable("continueWatching", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tmdbId: int("tmdbId").notNull(),
  mediaType: mysqlEnum("mediaType", ["movie", "tv"]).notNull(),
  title: text("title").notNull(),
  posterPath: varchar("posterPath", { length: 255 }),
  progress: int("progress").default(0).notNull(), // percentage watched
  lastWatchedAt: timestamp("lastWatchedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContinueWatching = typeof continueWatching.$inferSelect;
export type InsertContinueWatching = typeof continueWatching.$inferInsert;