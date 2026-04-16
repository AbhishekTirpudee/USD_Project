import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import ContentSlider from "@/components/ContentSlider";
import { SkeletonHeroBanner } from "@/components/Skeleton";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  // Fetch trending movies
  const trendingMoviesQuery = trpc.content.trending.movies.useQuery({
    timeWindow: "day",
  });

  // Fetch genres
  const movieGenresQuery = trpc.content.genres.movies.useQuery();

  // Fetch continue watching
  const continueWatchingQuery = trpc.content.continueWatching.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <Layout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonHeroBanner />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const heroBanner = trendingMoviesQuery.data?.[0];
  const genres = movieGenresQuery.data || [];

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        {heroBanner ? (
          <HeroBanner
            title={heroBanner.title}
            overview={heroBanner.overview}
            backdropPath={heroBanner.backdrop_path}
            posterPath={heroBanner.poster_path}
            id={heroBanner.id}
            mediaType="movie"
            voteAverage={heroBanner.vote_average}
          />
        ) : (
          <SkeletonHeroBanner />
        )}

        {/* Continue Watching */}
        {continueWatchingQuery.data && continueWatchingQuery.data.length > 0 && (
          <ContentSlider
            title="Continue Watching"
            items={continueWatchingQuery.data}
            isLoading={continueWatchingQuery.isLoading}
            mediaType="movie"
          />
        )}

        {/* Trending Now */}
        <ContentSlider
          title="Trending Now"
          items={trendingMoviesQuery.data || []}
          isLoading={trendingMoviesQuery.isLoading}
          mediaType="movie"
        />

        {/* Popular Genres */}
        {genres.slice(0, 5).map((genre) => (
          <ContentSlider
            key={genre.id}
            title={genre.name}
            items={[]}
            isLoading={false}
            mediaType="movie"
          />
        ))}
      </div>
    </Layout>
  );
}
