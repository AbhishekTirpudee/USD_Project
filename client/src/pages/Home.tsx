import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import ContentSlider from "@/components/ContentSlider";
import { SkeletonHeroBanner } from "@/components/Skeleton";
import { mockMovies } from "@/lib/mockData";
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

  const hasGithubIo = typeof window !== 'undefined' && window.location.hostname.includes("github.io");

  const heroBanner = (!hasGithubIo && trendingMoviesQuery.data?.[0]) ? trendingMoviesQuery.data[0] : mockMovies[0];
  const genres = (!hasGithubIo && movieGenresQuery.data?.length) ? movieGenresQuery.data : [{id: 1, name: "Action Placeholder"}, {id: 2, name: "Sci-Fi Series"}];

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
        {((continueWatchingQuery.data && continueWatchingQuery.data.length > 0) || hasGithubIo) && (
          <ContentSlider
            title="Continue Watching"
            items={(!hasGithubIo && continueWatchingQuery.data?.length) ? continueWatchingQuery.data : mockMovies.slice(0, 3)}
            isLoading={hasGithubIo ? false : continueWatchingQuery.isLoading}
            mediaType="movie"
          />
        )}

        {/* Trending Now */}
        <ContentSlider
          title="Trending Now"
          items={(!hasGithubIo && trendingMoviesQuery.data?.length) ? trendingMoviesQuery.data : mockMovies}
          isLoading={hasGithubIo ? false : trendingMoviesQuery.isLoading}
          mediaType="movie"
        />

        {/* Popular Genres */}
        {genres.slice(0, 5).map((genre) => (
          <ContentSlider
            key={genre.id}
            title={genre.name}
            items={hasGithubIo ? mockMovies.slice().reverse() : []}
            isLoading={false}
            mediaType="movie"
          />
        ))}
      </div>
    </Layout>
  );
}
