import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  {
    id: 1,
    title: "Solar System episode 1  VR",
    description: "Explore The Solar System in virtual reality",
    url: "https://www.youtube.com/embed/0ytyMKa8aps?si=ZrKbMAP0kw6icRGx",
    details: {
      duration: "4 minutes 41 seconds",
      category: "Solar System Exploration",
      features: [
        "360° views of planets and moons",
        "Weightless environment exploration",
        "Spacecraft flyby scenes"
      ]
    }
  },
  {
    id: 2,
    title: "Solar System episode 2  VR",
    description: "Explore The Solar System in virtual reality",
    url: "https://www.youtube.com/embed/sKVxN711hCA?si=Oty9Syb4LatdX2Ty",
    details: {
      duration: "8 minutes 12 seconds",
      category: "Solar System Exploration",
      features: [
        "360° views of planets and moons",
        "Rover interaction scenes",
        "Spacecraft flyby scenes"
      ]
    }
  },
  {
    id: 3,
    title: "Earth VR ",
    description: "Explore The Earth in virtual reality",
    url: "https://www.youtube.com/embed/hEdzv7D4CbQ?si=nh0nL79AHuBi68F8h",
    details: {
      duration: "6 minutes 24 seconds",
      category: "Earth Exploration",
      features: [
        "360° views of Earth's surface",
        "Weather patterns simulation",
        "Spacecraft flyby scenes"
      ]
    }
  },
  {
    id: 4,
    title: "Black Hole VR",
    description: "Explore The Black Hole in virtual reality",
    url: "https://www.youtube.com/embed/kQzjlHYeTCg?si=a19zXPtNR528zaCD",
    details: {
      duration: "2 minutes 18 seconds",
      category: "Black Hole Exploration",
      features: [
        "360° views of Black Hole",
        "Time dilation simulation",
        "Spacecraft flyby scenes"
      ]
    }
  }
];

const VRComponent = () => {
  const [expandedVideo, setExpandedVideo] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      
      <div className="relative z-10 container mx-auto px-4 py-12 mt-12">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center"
          animate={{ 
            backgroundPosition: ["0%", "100%", "0%"],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: "200% 100%"
          }}
        >
          Virtual Space Tours
        </motion.h2>

        <div className="space-y-6 max-w-4xl mx-auto">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              className="backdrop-blur-md bg-white/5 rounded-2xl p-6 transform transition-all duration-500 border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-blue-400">{video.title}</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExpandedVideo(expandedVideo === video.id ? null : video.id)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-white/80 hover:text-white"
                >
                  {expandedVideo === video.id ? "Show Less" : "Show More"}
                </motion.button>
              </div>

              <p className="text-gray-300 mb-4">{video.description}</p>

              <AnimatePresence>
                {expandedVideo === video.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="aspect-video w-full mb-4">
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={video.url}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>

                    <div className="grid gap-4 text-sm bg-white/5 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-purple-400">Duration</h4>
                          <p className="text-gray-300">{video.details.duration}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-400">Category</h4>
                          <p className="text-gray-300">{video.details.category}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-400">Features</h4>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                          {video.details.features.map((feature, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VRComponent;