import { motion } from "framer-motion";
import { Link } from "wouter";
import { Play, Plus, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath?: string | null;
  overview?: string;
  voteAverage?: number;
  releaseDate?: string;
  mediaType?: "movie" | "tv";
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({
  id,
  title,
  posterPath,
  overview,
  voteAverage,
  releaseDate,
  mediaType = "movie",
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = posterPath ? (posterPath.startsWith('/posters/') ? posterPath : `${TMDB_IMAGE_BASE}${posterPath}`) : "/placeholder.jpg";
  const detailsUrl = `/${mediaType}/${id}`;

  return (
    <Link href={detailsUrl}>
      <a>
        <motion.div
          className="relative rounded-lg overflow-hidden cursor-pointer group"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {/* Poster Image */}
          <div className="relative w-full aspect-[2/3] bg-gray-800 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Hover Card */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black/95 rounded-lg p-4 flex flex-col justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">{title}</h3>
                {releaseDate && (
                  <p className="text-gray-400 text-xs mb-2">
                    {new Date(releaseDate).getFullYear()}
                  </p>
                )}
                {overview && (
                  <p className="text-gray-300 text-xs line-clamp-3 mb-3">{overview}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  className="flex-1 bg-white text-black rounded py-2 font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={16} fill="currentColor" />
                  Play
                </motion.button>

                <motion.button
                  className="bg-gray-700 text-white rounded py-2 px-3 hover:bg-gray-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={18} />
                </motion.button>

                <motion.button
                  className="bg-gray-700 text-white rounded py-2 px-3 hover:bg-gray-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsUp size={18} />
                </motion.button>
              </div>

              {/* Rating */}
              {voteAverage && (
                <div className="text-yellow-400 text-xs font-semibold mt-2">
                  ★ {(voteAverage / 2).toFixed(1)}/5
                </div>
              )}
            </motion.div>
          )}

          {/* Title Overlay (non-hover) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
            <h3 className="text-white font-semibold text-sm line-clamp-2">{title}</h3>
          </div>
        </motion.div>
      </a>
    </Link>
  );
}
