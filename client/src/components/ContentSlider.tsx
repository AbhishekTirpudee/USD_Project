import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import MovieCard from "./MovieCard";
import { SkeletonRow } from "./Skeleton";

interface ContentSliderProps {
  title: string;
  items: any[];
  isLoading?: boolean;
  mediaType?: "movie" | "tv";
}

export default function ContentSlider({
  title,
  items,
  isLoading = false,
  mediaType = "movie",
}: ContentSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 px-4 sm:px-6 lg:px-8">{title}</h2>

      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <motion.button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}

        {/* Content Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8"
          onScroll={checkScroll}
          style={{ scrollBehavior: "smooth" }}
        >
          {isLoading ? (
            <SkeletonRow count={6} />
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-40 sm:w-48">
                <MovieCard
                  id={item.id}
                  title={item.title || item.name}
                  posterPath={item.poster_path}
                  overview={item.overview}
                  voteAverage={item.vote_average}
                  releaseDate={item.release_date || item.first_air_date}
                  mediaType={mediaType}
                />
              </div>
            ))
          )}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <motion.button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll("right")}
          >
            <ChevronRight size={24} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
