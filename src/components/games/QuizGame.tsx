import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Record<string, Question[]> = {
  easy: [
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Mercury"],
      correctAnswer: 1,
      explanation: "Mars is called the Red Planet because of its reddish appearance, caused by iron oxide (rust) on its surface."
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Saturn", "Mars", "Jupiter", "Neptune"],
      correctAnswer: 2,
      explanation: "Jupiter is the largest planet in our solar system, with a mass more than twice that of all other planets combined."
    },
    {
      question: "What is the closest planet to the Sun?",
      options: ["Venus", "Mars", "Earth", "Mercury"],
      correctAnswer: 3,
      explanation: "Mercury is the closest planet to the Sun, orbiting at an average distance of about 36 million miles."
    },
    {
      question: "Which planet is known as the 'Evening Star'?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 0,
      explanation: "Venus is often called the Evening Star when visible after sunset, being the brightest natural object in Earth's night sky after the Moon."
    },
    {
      question: "What is the name of Earth's natural satellite?",
      options: ["Titan", "Europa", "The Moon", "Phobos"],
      correctAnswer: 2,
      explanation: "The Moon is Earth's only natural satellite, orbiting our planet at an average distance of 238,855 miles."
    },
    {
      question: "Which planet is known for its beautiful rings?",
      options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
      correctAnswer: 1,
      explanation: "Saturn is famous for its spectacular ring system, which is composed mostly of ice particles, rocky debris, and dust."
    },
    {
      question: "What is the name of our galaxy?",
      options: ["Andromeda", "Milky Way", "Triangulum", "Sombrero"],
      correctAnswer: 1,
      explanation: "The Milky Way is our home galaxy, containing our solar system along with billions of other stars."
    },
    {
      question: "Which is the hottest planet in our solar system?",
      options: ["Mercury", "Venus", "Mars", "Jupiter"],
      correctAnswer: 1,
      explanation: "Venus is the hottest planet due to its thick atmosphere creating a strong greenhouse effect, with surface temperatures reaching 462°C."
    },
    {
      question: "What causes day and night on Earth?",
      options: ["Earth's orbit around the Sun", "Earth's rotation on its axis", "The Moon's orbit", "Solar winds"],
      correctAnswer: 1,
      explanation: "Earth's rotation on its axis causes day and night, with one complete rotation taking approximately 24 hours."
    },
    {
      question: "What is a shooting star?",
      options: ["A star falling", "A meteor", "A planet", "A satellite"],
      correctAnswer: 1,
      explanation: "A shooting star is actually a meteor - a space rock that burns up as it enters Earth's atmosphere."
    }
  ],
  medium: [
    {
      question: "What causes the Moon's phases?",
      options: ["Earth's shadow", "The Moon's position relative to Earth and Sun", "The Moon's rotation speed", "Solar winds"],
      correctAnswer: 1,
      explanation: "Moon phases occur due to the changing relative positions of the Earth, Moon, and Sun, affecting how much of the Moon's sunlit surface we see."
    },
    {
      question: "What is the asteroid belt?",
      options: ["A ring around Saturn", "A region between Mars and Jupiter", "A belt around Earth", "A region beyond Neptune"],
      correctAnswer: 1,
      explanation: "The asteroid belt is a region between Mars and Jupiter containing many asteroids and minor planets."
    },
    {
      question: "What is a light year?",
      options: ["The time light takes to reach Earth", "The distance light travels in one year", "The speed of light", "The age of starlight"],
      correctAnswer: 1,
      explanation: "A light year is the distance light travels in one year, approximately 9.46 trillion kilometers."
    },
    {
      question: "What causes solar eclipses?",
      options: ["Earth's shadow on the Sun", "The Moon passing between Earth and Sun", "Sun spots", "Planetary alignment"],
      correctAnswer: 1,
      explanation: "Solar eclipses occur when the Moon passes between Earth and the Sun, temporarily blocking some or all of the Sun's light."
    },
    {
      question: "What is the Great Red Spot on Jupiter?",
      options: ["A volcano", "A storm", "A crater", "A mountain"],
      correctAnswer: 1,
      explanation: "The Great Red Spot is a giant storm in Jupiter's atmosphere that has been raging for at least 400 years."
    },
    {
      question: "What are Saturn's rings made of?",
      options: ["Gas", "Ice and rock particles", "Metal", "Liquid"],
      correctAnswer: 1,
      explanation: "Saturn's rings are composed mainly of ice particles with some rocky debris and dust."
    },
    {
      question: "What is a nebula?",
      options: ["A type of star", "A cloud of gas and dust", "A black hole", "A galaxy"],
      correctAnswer: 1,
      explanation: "A nebula is a giant cloud of gas and dust in space, often a region where new stars are being formed."
    },
    {
      question: "What causes the seasons on Earth?",
      options: ["Distance from the Sun", "Earth's tilted axis", "The Moon's gravity", "Ocean currents"],
      correctAnswer: 1,
      explanation: "Earth's seasons are caused by its tilted axis as it orbits the Sun, affecting how directly sunlight hits different parts of Earth."
    },
    {
      question: "What is a dwarf planet?",
      options: ["A small star", "A planet that orbits the Sun but hasn't cleared its orbit", "A moon", "An asteroid"],
      correctAnswer: 1,
      explanation: "A dwarf planet orbits the Sun but hasn't cleared its orbital neighborhood of other objects. Pluto is a famous example."
    },
    {
      question: "What is the aurora borealis?",
      options: ["A constellation", "The Northern Lights", "A comet", "A type of star"],
      correctAnswer: 1,
      explanation: "The aurora borealis (Northern Lights) is caused by solar particles interacting with Earth's magnetic field."
    }
  ],
  hard: [
    {
      question: "What is a Kuiper Belt Object (KBO)?",
      options: ["A type of asteroid", "A trans-Neptunian object", "A meteor shower", "A type of galaxy"],
      correctAnswer: 1,
      explanation: "Kuiper Belt Objects are icy bodies orbiting beyond Neptune in a region called the Kuiper Belt."
    },
    {
      question: "What is the Chandrasekhar limit?",
      options: ["Maximum size of a planet", "Maximum mass of a white dwarf star", "Minimum size of a galaxy", "Speed of light limit"],
      correctAnswer: 1,
      explanation: "The Chandrasekhar limit is the maximum mass a white dwarf star can have before it collapses into a neutron star."
    },
    {
      question: "What is a magnetar?",
      options: ["A magnetic field detector", "A highly magnetized neutron star", "A type of compass", "A magnetic asteroid"],
      correctAnswer: 1,
      explanation: "A magnetar is a type of neutron star with an extremely powerful magnetic field."
    },
    {
      question: "What is the Sagittarius A*?",
      options: ["A constellation", "The supermassive black hole at our galaxy's center", "A type of star", "A nebula"],
      correctAnswer: 1,
      explanation: "Sagittarius A* is the supermassive black hole at the center of our Milky Way galaxy."
    },
    {
      question: "What is dark energy?",
      options: ["Black holes", "A hypothetical form of energy causing universe expansion", "Anti-matter", "Invisible stars"],
      correctAnswer: 1,
      explanation: "Dark energy is a hypothetical form of energy thought to be responsible for the accelerating expansion of the universe."
    },
    {
      question: "What is the Oort Cloud?",
      options: ["A type of weather", "A spherical cloud of icy objects at solar system's edge", "A nebula", "An asteroid field"],
      correctAnswer: 1,
      explanation: "The Oort Cloud is a theoretical spherical cloud of icy objects at the outer edge of our solar system."
    },
    {
      question: "What is a pulsar?",
      options: ["A type of galaxy", "A rotating neutron star", "A black hole", "A type of planet"],
      correctAnswer: 1,
      explanation: "A pulsar is a highly magnetized, rotating neutron star that emits beams of electromagnetic radiation."
    },
    {
      question: "What is the cosmological principle?",
      options: ["Universal speed limit", "The idea that universe looks same everywhere", "Theory of everything", "Big Bang theory"],
      correctAnswer: 1,
      explanation: "The cosmological principle states that the universe looks essentially the same in all directions and has no center."
    },
    {
      question: "What is quantum entanglement?",
      options: ["Atomic fusion", "Physical phenomenon where particles remain connected", "Black hole theory", "Star formation"],
      correctAnswer: 1,
      explanation: "Quantum entanglement is a phenomenon where particles become connected and affect each other instantly regardless of distance."
    },
    {
      question: "What is a gravitational wave?",
      options: ["Ocean wave", "Ripple in space-time", "Sound wave in space", "Light wave"],
      correctAnswer: 1,
      explanation: "Gravitational waves are ripples in the fabric of space-time caused by some of the most energetic processes in the universe."
    }
  ]
};

const QuizGame = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const settings = localStorage.getItem('gameSettings');
    if (!settings) {
      navigate('/games/space-quiz-challenge');
      return;
    }

    const { difficulty, questionCount } = JSON.parse(settings);
    const difficultyQuestions = questions[difficulty];
    const shuffled = [...difficultyQuestions].sort(() => Math.random() - 0.5);
    setGameQuestions(shuffled.slice(0, questionCount));
  }, [navigate]);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    if (answerIndex === gameQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    if (currentQuestion + 1 >= gameQuestions.length) {
      setGameOver(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (gameQuestions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-12 mt-8">
        {!gameOver ? (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <span className="text-purple-400">Question {currentQuestion + 1}/{gameQuestions.length}</span>
              <span className="text-purple-400">Score: {score}</span>
            </div>

            <motion.div 
              className="backdrop-blur-md bg-white/5 rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6">{gameQuestions[currentQuestion].question}</h2>
              
              <div className="space-y-4">
                {gameQuestions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                      selectedAnswer === null
                        ? 'bg-white/5 hover:bg-white/10'
                        : selectedAnswer === index
                        ? index === gameQuestions[currentQuestion].correctAnswer
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-red-500/20 border-red-500'
                        : index === gameQuestions[currentQuestion].correctAnswer
                        ? 'bg-green-500/20 border-green-500'
                        : 'bg-white/5'
                    } border border-white/10`}
                    whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <p className="text-gray-300">{gameQuestions[currentQuestion].explanation}</p>
                    <motion.button
                      onClick={nextQuestion}
                      className="mt-4 px-6 py-2 bg-purple-500/20 rounded-full text-white hover:bg-purple-500/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next Question
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="max-w-2xl mx-auto backdrop-blur-md bg-white/5 rounded-2xl p-8 border border-white/10 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-2xl mb-6">Your Score: {score}/{gameQuestions.length}</p>
            <div className="space-x-4">
              <motion.button
                onClick={() => navigate('/games/space-quiz-challenge')}
                className="px-6 py-2 bg-purple-500/20 rounded-full text-white hover:bg-purple-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
              <motion.button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-blue-500/20 rounded-full text-white hover:bg-blue-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
};

export default QuizGame;
