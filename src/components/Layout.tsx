import { type ReactNode, useState } from 'react';
import logoUrl from '../assets/logo.svg';
import { Link, NavLink } from 'react-router-dom';
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
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute top-4 left-4 bg-white/6 text-white px-3 py-2 rounded-md z-60">Skip to content</a>
      <nav className="fixed top-0 w-full bg-space-black/85 backdrop-blur-md z-50 border-b border-gray-800/40">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="NASA Space Apps" className="w-10 h-10 object-contain" />
              ) : (
                <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <defs>
                    <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#2563eb" />
                      <stop offset="1" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <rect width="48" height="48" rx="8" fill="url(#logoGrad)" />
                  <circle cx="24" cy="17" r="6" fill="white" fillOpacity="0.12" />
                </svg>
              )}
              <div className="text-lg md:text-2xl font-futuristic text-white leading-tight">
                <span className="font-bold">NASA</span> Space Apps
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm md:text-base">
              {[
                { to: '/', label: 'Home' },
                { to: '/explore', label: 'Explore' },
                { to: '/about', label: 'About' },
                { to: '/team', label: 'Team' },
                { to: '/planets', label: 'Planets' },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `px-2 py-1 rounded-md transition ${isActive ? 'bg-white/8 text-white ring-1 ring-white/10' : 'text-white hover:text-blue-300'}`}
                >
                  {item.label}
                </NavLink>
              ))}
              <a href="https://github.com/yourusername/nasa-space-apps-2025" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-white hover:text-blue-300 transition flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.38-3.87-1.38-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.71 5.39-5.29 5.67.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.38 24 17.08 24 12 24 5.73 18.27.5 12 .5z"/>
                </svg>
                <span className="hidden md:inline">GitHub</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3">
              <Link to="/explore" className="hidden md:inline-flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-2 rounded-md text-sm font-semibold shadow-md">Explore</Link>
              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-white transition p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
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
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-3 bg-space-black/85 border border-gray-800/40 rounded-lg p-3 shadow-xl"
              >
                <div className="flex flex-col gap-2">
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/explore', label: 'Explore' },
                    { to: '/about', label: 'About' },
                    { to: '/team', label: 'Team' },
                    { to: '/planets', label: 'Planets' },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => `block px-3 py-2 rounded-md transition ${isActive ? 'bg-white/8 text-white' : 'text-white hover:text-blue-300'}`}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <a 
                    href="https://github.com/yourusername/nasa-space-apps-2025" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-300 transition px-3 py-2 rounded-md"
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
      
      <footer className="bg-space-black/95 text-white py-10 mt-12 border-t border-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-lg font-semibold">NASA Space Apps</div>
              <p className="text-gray-300 text-sm mt-2 max-w-sm">Explore planetary and Earth datasets with a modern viewer, time slider, and annotation tools. Built for learning, research, and discovery.</p>
              <div className="flex items-center gap-3 mt-4">
                <a href="https://github.com/yourusername/nasa-space-apps-2025" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-white/6 hover:bg-white/8 transition">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.38-3.87-1.38-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.71 5.39-5.29 5.67.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.38 24 17.08 24 12 24 5.73 18.27.5 12 .5z"/></svg>
                </a>
                <a href="#" className="p-2 rounded-md bg-white/6 hover:bg-white/8 transition">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 0 0 1.88-2.37 8.51 8.51 0 0 1-2.71 1.03 4.25 4.25 0 0 0-7.24 3.87A12.06 12.06 0 0 1 3.1 4.9a4.23 4.23 0 0 0 1.32 5.67 4.2 4.2 0 0 1-1.92-.53v.05a4.24 4.24 0 0 0 3.41 4.16 4.3 4.3 0 0 1-1.91.07 4.25 4.25 0 0 0 3.97 2.96 8.53 8.53 0 0 1-5.28 1.82A8.8 8.8 0 0 1 2 19.54 12.05 12.05 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.69 0-.18-.01-.36-.02-.53A8.35 8.35 0 0 0 22.46 6z"/></svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-200">Quick Links</h4>
                <ul className="mt-3 space-y-2 text-gray-300 text-sm">
                  <li><Link to="/explore" className="hover:text-white transition">Explore</Link></li>
                  <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                  <li><Link to="/team" className="hover:text-white transition">Team</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-200">Resources</h4>
                <ul className="mt-3 space-y-2 text-gray-300 text-sm">
                  <li><a href="https://earthdata.nasa.gov" className="hover:text-white transition">Earth Data</a></li>
                  <li><a href="https://gibs.earthdata.nasa.gov" className="hover:text-white transition">GIBS</a></li>
                  <li><a href="https://api.nasa.gov" className="hover:text-white transition">NASA API</a></li>
                </ul>
              </div>

            </div>

            <div className="md:col-span-3 mt-6 text-xs text-gray-500 text-center">© {new Date().getFullYear()} NASA Space Apps — This project uses NASA data and imagery. All NASA content remains in the public domain.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};