import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <motion.div
        className="relative w-full h-screen bg-gradient-to-r from-black via-black/80 to-transparent flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-r from-red-600/20 to-purple-600/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Entertainment,
              <span className="text-red-600"> Reimagined</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Stream thousands of movies and TV shows. Watch anytime, anywhere. Cancel anytime.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12 max-w-xl">
              <div>
                <p className="text-3xl font-bold text-red-600">10K+</p>
                <p className="text-gray-400 text-sm">Titles</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">4K</p>
                <p className="text-gray-400 text-sm">Ultra HD</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">24/7</p>
                <p className="text-gray-400 text-sm">Support</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link href="/home">
                  <a>
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold flex items-center gap-2">
                      <Play size={24} fill="currentColor" />
                      Start Watching
                    </Button>
                  </a>
                </Link>
              ) : (
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold flex items-center gap-2"
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  <Play size={24} fill="currentColor" />
                  Sign In
                </Button>
              )}

              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold flex items-center gap-2"
              >
                <Info size={24} />
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-gray-400 text-center">
            <p className="text-sm mb-2">Scroll to explore</p>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-gray-400 rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Why Choose Us?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Vast Library",
              description: "Access thousands of movies, TV shows, and documentaries",
              icon: "🎬",
            },
            {
              title: "Watch Anywhere",
              description: "Stream on your phone, tablet, laptop, or TV",
              icon: "📱",
            },
            {
              title: "Personalized",
              description: "Recommendations tailored to your viewing habits",
              icon: "⭐",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-gray-900 rounded-lg p-8 hover:bg-gray-800 transition"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-r from-red-600/10 to-purple-600/10 border-y border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join millions of viewers enjoying premium entertainment.
          </p>

          {!isAuthenticated && (
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Sign Up Now
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
