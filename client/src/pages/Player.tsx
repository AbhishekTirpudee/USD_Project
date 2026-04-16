import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { ArrowLeft, Play, Pause, Volume2, Maximize } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Player() {
  const [match, params] = useRoute("/:mediaType/:id/play");
  const { isAuthenticated } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const addToContinueWatchingMutation = trpc.content.continueWatching.add.useMutation();

  const handleProgressChange = (newProgress: number) => {
    setProgress(newProgress);

    if (detailsQuery.data && isAuthenticated) {
      addToContinueWatchingMutation.mutate({
        tmdbId: id,
        mediaType,
        title: (detailsQuery.data as any).title || (detailsQuery.data as any).name,
        posterPath: (detailsQuery.data as any).poster_path,
        progress: newProgress,
      });
    }
  };

  const data = detailsQuery.data as any;
  const title = data?.title || data?.name || "Loading...";

  return (
    <Layout showFooter={false}>
      <div className="bg-black min-h-screen flex flex-col">
        {/* Player Container */}
        <div className="relative w-full bg-black flex-1 flex items-center justify-center">
          {/* Video Player Placeholder */}
          <div className="w-full aspect-video bg-gray-900 relative group">
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-full transition"
              >
                {isPlaying ? (
                  <Pause size={48} fill="currentColor" />
                ) : (
                  <Play size={48} fill="currentColor" />
                )}
              </button>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-600 rounded cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>{Math.floor(progress)}%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="text-white hover:text-gray-300 transition p-2">
                    <Volume2 size={20} />
                  </button>
                </div>

                <button className="text-white hover:text-gray-300 transition p-2">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="bg-gray-900 border-t border-gray-800 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/${mediaType}/${id}`}>
                <a className="text-gray-400 hover:text-white transition p-2">
                  <ArrowLeft size={24} />
                </a>
              </Link>
              <div>
                <h2 className="text-white font-bold text-lg">{title}</h2>
                <p className="text-gray-400 text-sm">
                  {Math.floor(progress)}% watched
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
