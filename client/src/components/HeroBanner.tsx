import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import { Link } from "wouter";
import { SkeletonHeroBanner } from "./Skeleton";

interface HeroBannerProps {
  title: string;
  overview: string;
  backdropPath?: string | null;
  posterPath?: string | null;
  id: number;
  mediaType?: "movie" | "tv";
  isLoading?: boolean;
  voteAverage?: number;
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w1280";

export default function HeroBanner({
  title,
  overview,
  backdropPath,
  posterPath,
  id,
  mediaType = "movie",
  isLoading = false,
  voteAverage,
}: HeroBannerProps) {
  if (isLoading) {
    return <SkeletonHeroBanner />;
  }

  const getImageUrl = (path?: string | null) => {
    if (!path) return null;
    return path.startsWith('/posters/') ? path : `${TMDB_IMAGE_BASE}${path}`;
  };

  const imageUrl = getImageUrl(backdropPath) || getImageUrl(posterPath) || "/placeholder.jpg";

  const detailsUrl = `/${mediaType}/${id}`;

  return (
    <motion.div
      className="relative w-full h-96 sm:h-[500px] md:h-[600px] rounded-lg overflow-hidden group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 line-clamp-2">
            {title}
          </h1>

          {voteAverage && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 font-semibold">★ {(voteAverage / 2).toFixed(1)}/5</span>
              <span className="text-gray-300 text-sm">({voteAverage}% match)</span>
            </div>
          )}

          <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 line-clamp-3 max-w-2xl">
            {overview}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link href={`${detailsUrl}/play`}>
              <a>
                <motion.button
                  className="bg-white text-black px-6 sm:px-8 py-2 sm:py-3 rounded font-semibold flex items-center gap-2 hover:bg-gray-200 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={20} fill="currentColor" />
                  Play
                </motion.button>
              </a>
            </Link>

            <Link href={detailsUrl}>
              <a>
                <motion.button
                  className="bg-gray-600/50 text-white px-6 sm:px-8 py-2 sm:py-3 rounded font-semibold flex items-center gap-2 hover:bg-gray-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Info size={20} />
                  More Info
                </motion.button>
              </a>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
