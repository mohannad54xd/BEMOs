import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import React, { useRef } from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  index: number;
}

interface CardsProps {
  title?: string;
  items?: Array<{
    title: string;
    description: string;
    imageUrl: string;
    link: string;
  }>;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, link, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const navigate = useNavigate();

  const handleClick = () => {
    if (title === "Lunar Trek") {
      navigate('/globe-exploration');
      return;
    }
    if (link) {
      navigate(link);
    }
  };

  return (
    <motion.div 
      id='explore'
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.2, 0.65, 0.3, 0.9]
      }}
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      className="backdrop-blur-lg bg-white/5 rounded-2xl overflow-hidden transform transition-all duration-500 shadow-xl cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden" >
        <motion.img 
          src={imageUrl} 
          alt={title}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <motion.h3 
          className="text-2xl font-bold mb-2"
          animate={{ 
            backgroundPosition: ["0%", "100%"],
            backgroundSize: ["100%", "200%"]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: "linear-gradient(to right, #60A5FA, #A855F7, #60A5FA)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </motion.h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-300"
        >
          {title === "Lunar Trek" ? "Learn More" : "Learn More"}
        </motion.button>
      </div>
    </motion.div>
  );
};

const cardsData = [
  {
    title: "Solar System",
    description: "Explore our cosmic neighborhood and learn about the planets that orbit our Sun.",
    imageUrl: "/textures/solar-system.png",
    link: "/solar-system"
  },
  {
    title: "Lunar Trek",
    description: "Explore the Moon's surface in our interactive 3D globe explorer.",
    imageUrl: "/moon.jpg",
    link: ""
  },
  {
    title: "Exoplanets",
    description: "Learn about the planets that are not in our solar system and explore their mysteries.",
    imageUrl: "/exoplanets.jpg",
    link: "/exoplanets"
  },
  {
    title: "Seismic Events",
    description: "Explore the seismic events that occur on Earth and learn about their impact.",
    imageUrl: "/articles.jpeg",
    link: "/seismic-events"
  },
  {
    title: "VR Experience",
    description: "Experience the cosmos in virtual reality and explore the wonders of the universe.",
    imageUrl: "/textures/stars.jpg",
    link: "/vr"
  },
  {
    title: "Articles",
    description: "Read articles about the latest discoveries in astronomy and space exploration.",
    imageUrl: "/articles.jpeg",
    link: "/article"
  }
];

const Cards: React.FC<CardsProps> = ({ title, items }) => {
  const list = items && items.length ? items : cardsData;
  return (
    <div className="container mx-auto px-4 py-16">
      {title && <h3 className="text-2xl font-semibold text-white mb-6">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((card, index) => (
          <Card key={index} {...card} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Cards;