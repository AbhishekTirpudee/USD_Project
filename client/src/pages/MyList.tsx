import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import { SkeletonRow } from "@/components/Skeleton";

export default function MyList() {
  const { isAuthenticated } = useAuth();

  const watchlistQuery = trpc.content.watchlist.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">My List</h1>

        {watchlistQuery.isLoading ? (
          <SkeletonRow count={12} />
        ) : watchlistQuery.data && watchlistQuery.data.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {watchlistQuery.data.map((item) => (
              <MovieCard
                key={item.id}
                id={item.tmdbId}
                title={item.title}
                posterPath={item.posterPath}
                mediaType={item.mediaType}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Your list is empty</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
