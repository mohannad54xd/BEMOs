import { motion } from 'framer-motion';

export const AboutPage = () => {
  return (
  <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Our Mission
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Created for NASA Space Apps Challenge 2025, we're revolutionizing how people explore 
              and interact with NASA's massive datasets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">The Challenge</h2>
              <p className="text-lg text-gray-300 mb-6">
                NASA's space missions capture billions of pixels of data every day. From 10-gigapixel 
                images of space to terapixel visual datasets, the amount of information is overwhelming 
                and growing exponentially.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                Current tools for exploring these massive datasets are not user-friendly or only show 
                parts of images rather than allowing us to see the full picture. We need new ways to 
                bring these enormous datasets to life.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-8 border border-gray-700/50"
            >
              <h3 className="text-2xl font-semibold mb-4 text-white">Our Solution</h3>
          <p className="text-gray-300 mb-6">
                We've created an interactive platform that makes NASA's massive datasets accessible 
                and engaging for everyone, from students to researchers.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Interactive zoomable viewer for massive datasets
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Time-based exploration of Earth's changes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Annotation system for discovery and learning
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Multiple data layers and visualizations
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Key Features
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Deep Zoom Technology",
                description: "Powered by OpenSeadragon, explore NASA's gigapixel images with smooth, high-performance zooming and panning capabilities."
              },
              {
                icon: "⏰",
                title: "Temporal Exploration",
                description: "Navigate through time with our intuitive slider to see how Earth and other celestial bodies change over time."
              },
              {
                icon: "📝",
                title: "Smart Annotations",
                description: "Mark and label features you discover for future reference, perfect for research and educational purposes."
              },
              {
                icon: "🌍",
                title: "Multiple Datasets",
                description: "Switch between different NASA datasets including Earth imagery, lunar maps, and space observations."
              },
              {
                icon: "🎨",
                title: "Layer Comparison",
                description: "Compare different visualizations and data layers to gain deeper insights into the data."
              },
              {
                icon: "📱",
                title: "Responsive Design",
                description: "Fully responsive interface that works seamlessly on desktop, tablet, and mobile devices."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Technology Stack</h2>
            <p className="text-lg text-gray-300 mb-12">
              Built with modern web technologies to deliver the best possible experience
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "React", description: "Frontend Framework" },
                { name: "TypeScript", description: "Type Safety" },
                { name: "OpenSeadragon", description: "Image Viewer" },
                { name: "Framer Motion", description: "Animations" },
                { name: "Tailwind CSS", description: "Styling" },
                { name: "NASA GIBS", description: "Data Source" },
                { name: "Vite", description: "Build Tool" },
                { name: "React Router", description: "Navigation" }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <h3 className="font-semibold text-white mb-2">{tech.name}</h3>
                  <p className="text-sm text-gray-400">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* NASA Disclaimer */}
      <section className="py-12 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-semibold mb-4 text-white">NASA Data Usage</h3>
            <p className="text-gray-300 mb-4">
              This project uses NASA data and imagery through the Global Imagery Browse Services (GIBS). 
              All NASA content remains in the public domain and is available for educational and research purposes.
            </p>
            <p className="text-sm text-gray-400">
              Created for NASA Space Apps Challenge 2025 • 
              <a href="https://www.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-1">
                Learn more about NASA
              </a>
            </p>
          </motion.div>
      </div>
      </section>
    </div>
  );
};