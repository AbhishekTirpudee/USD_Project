import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Play, Plus, Share2 } from "lucide-react";
import { Link } from "wouter";
import { SkeletonHeroBanner } from "@/components/Skeleton";

export default function MovieDetails() {
  const [match, params] = useRoute("/:mediaType/:id");
  const { isAuthenticated } = useAuth();

  const mediaType = (params?.mediaType as "movie" | "tv") || "movie";
  const id = parseInt(params?.id || "0");

  const movieDetailsQuery = trpc.content.details.movie.useQuery(
    { movieId: id },
    { enabled: mediaType === "movie" && !!id }
  );

  const showDetailsQuery = trpc.content.details.show.useQuery(
    { showId: id },
    { enabled: mediaType === "tv" && !!id }
  );

  const detailsQuery = mediaType === "movie" ? movieDetailsQuery : showDetailsQuery;

  const isInWatchlistQuery = trpc.content.watchlist.isInWatchlist.useQuery(
    { tmdbId: id, mediaType },
    { enabled: isAuthenticated && !!id }
  );

  const addToWatchlistMutation = trpc.content.watchlist.add.useMutation();
  const removeFromWatchlistMutation = trpc.content.watchlist.remove.useMutation();

  const handleWatchlistToggle = async () => {
    if (!detailsQuery.data) return;

    if (isInWatchlistQuery.data) {
      await removeFromWatchlistMutation.mutateAsync({
        tmdbId: id,
        mediaType,
      });
    } else {
      await addToWatchlistMutation.mutateAsync({
        tmdbId: id,
        mediaType,
        title: (detailsQuery.data as any).title || (detailsQuery.data as any).name,
        posterPath: (detailsQuery.data as any).poster_path,
      });
    }

    isInWatchlistQuery.refetch();
  };

  if (detailsQuery.isLoading) {
    return (
      <Layout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonHeroBanner />
        </div>
      </Layout>
    );
  }

  if (!detailsQuery.data) {
    return (
      <Layout>
        <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-400 text-lg">Content not found</p>
        </div>
      </Layout>
    );
  }

  const data = detailsQuery.data as any;
  const title = data.title || data.name;
  const backdropUrl = data.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
    : "/placeholder.jpg";

  return (
    <Layout>
      <div className="relative">
        {/* Backdrop */}
        <div className="relative h-96 sm:h-[500px] md:h-[600px] overflow-hidden">
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative -mt-32 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6">
              {data.genres?.map((genre: any) => (
                <span
                  key={genre.id}
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {data.vote_average && (
              <p className="text-yellow-400 font-semibold mb-6">
                ★ {(data.vote_average / 2).toFixed(1)}/5
              </p>
            )}

            <p className="text-gray-300 text-lg mb-8 max-w-2xl">
              {data.overview}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 bg-gray-900/50 p-6 rounded-lg">
              {mediaType === "movie" && (
                <>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Runtime</p>
                    <p className="text-white font-semibold">
                      {data.runtime} min
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Release Date</p>
                    <p className="text-white font-semibold">
                      {new Date(data.release_date).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
              {mediaType === "tv" && (
                <>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Seasons</p>
                    <p className="text-white font-semibold">
                      {data.number_of_seasons}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Episodes</p>
                    <p className="text-white font-semibold">
                      {data.number_of_episodes}
                    </p>
                  </div>
                </>
              )}
              <div>
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-white font-semibold">{data.status}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href={`/${mediaType}/${id}/play`}>
                <a>
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold flex items-center gap-2">
                    <Play size={24} fill="currentColor" />
                    Play
                  </Button>
                </a>
              </Link>

              {isAuthenticated && (
                <>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-6 py-3"
                    onClick={handleWatchlistToggle}
                  >
                    <Plus size={20} />
                    {isInWatchlistQuery.data ? "Remove" : "Add to List"}
                  </Button>

                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-6 py-3"
                  >
                    <Share2 size={20} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
