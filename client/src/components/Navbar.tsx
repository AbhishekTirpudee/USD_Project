import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white group-hover:bg-red-700 transition">
                N
              </div>
              <span className="text-white font-bold text-xl hidden sm:inline">Netflix</span>
            </a>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/home">
              <a className="text-gray-300 hover:text-white transition">Home</a>
            </Link>
            <Link href="/search">
              <a className="text-gray-300 hover:text-white transition">Search</a>
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/my-list">
                  <a className="text-gray-300 hover:text-white transition">My List</a>
                </Link>
                <Link href="/profile">
                  <a className="text-gray-300 hover:text-white transition">Profile</a>
                </Link>
              </>
            )}
          </div>

          {/* Right side - Search and Auth */}
          <div className="flex items-center gap-4">
            <button className="text-gray-300 hover:text-white transition p-2">
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <User size={18} />
                  <span className="hidden sm:inline text-sm">{user?.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white border-white hover:bg-white/10"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-black/95 border-t border-gray-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-4 py-4 space-y-3">
              <Link href="/home">
                <a className="block text-gray-300 hover:text-white transition py-2">Home</a>
              </Link>
              <Link href="/search">
                <a className="block text-gray-300 hover:text-white transition py-2">Search</a>
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/my-list">
                    <a className="block text-gray-300 hover:text-white transition py-2">My List</a>
                  </Link>
                  <Link href="/profile">
                    <a className="block text-gray-300 hover:text-white transition py-2">Profile</a>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
