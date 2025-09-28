import { type ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-space-black">
      <nav className="fixed top-0 w-full bg-space-black/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl md:text-2xl font-futuristic text-white">
              NASA Space Apps
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6">
              <Link to="/" className="text-white hover:text-blue-400 transition">Home</Link>
              <Link to="/explore" className="text-white hover:text-blue-400 transition">Explore</Link>
              <Link to="/about" className="text-white hover:text-blue-400 transition">About</Link>
              <Link to="/team" className="text-white hover:text-blue-400 transition">Team</Link>
              <a href="https://github.com/yourusername/nasa-space-apps-2025" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-white hover:text-blue-400 transition">
                GitHub
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-white hover:text-blue-400 transition"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 border-t border-gray-700"
              >
                <div className="flex flex-col gap-4 py-4">
                  <Link 
                    to="/" 
                    className="text-white hover:text-blue-400 transition py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/explore" 
                    className="text-white hover:text-blue-400 transition py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Explore
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-white hover:text-blue-400 transition py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to="/team" 
                    className="text-white hover:text-blue-400 transition py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Team
                  </Link>
                  <a 
                    href="https://github.com/yourusername/nasa-space-apps-2025" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 transition py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    GitHub
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      
      <main className="pt-16 md:pt-20">
        {children}
      </main>
      
      <footer className="bg-space-black/90 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm">
              Created for NASA Space Apps Challenge 2025
            </p>
            <p className="text-xs mt-2 text-gray-400">
              This project uses NASA data and imagery. All NASA content remains in the public domain.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
              <a href="https://www.nasa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
                NASA.gov
              </a>
              <span>•</span>
              <a href="https://earthdata.nasa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
                Earth Data
              </a>
              <span>•</span>
              <a href="https://spaceappschallenge.org" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
                Space Apps
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};