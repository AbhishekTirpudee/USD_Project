import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import { SkeletonRow } from "@/components/Skeleton";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"movie" | "tv">("movie");

  const searchMoviesQuery = trpc.content.search.movies.useQuery(
    { query, page: 1 },
    { enabled: query.length > 0 && searchType === "movie" }
  );

  const searchShowsQuery = trpc.content.search.shows.useQuery(
    { query, page: 1 },
    { enabled: query.length > 0 && searchType === "tv" }
  );

  const results = searchType === "movie" ? searchMoviesQuery.data : searchShowsQuery.data;
  const isLoading = searchType === "movie" ? searchMoviesQuery.isLoading : searchShowsQuery.isLoading;

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Search movies and shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setSearchType("movie")}
              className={`px-4 py-2 rounded font-semibold transition ${
                searchType === "movie"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setSearchType("tv")}
              className={`px-4 py-2 rounded font-semibold transition ${
                searchType === "tv"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              TV Shows
            </button>
          </div>
        </div>

        {/* Results */}
        {query ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Results for "{query}"
            </h2>

            {isLoading ? (
              <SkeletonRow count={12} />
            ) : results && results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.map((item: any) => (
                  <MovieCard
                    key={item.id}
                    id={item.id}
                    title={item.title || item.name}
                    posterPath={item.poster_path}
                    overview={item.overview}
                    voteAverage={item.vote_average}
                    releaseDate={item.release_date || item.first_air_date}
                    mediaType={searchType}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No results found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Start typing to search...</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
