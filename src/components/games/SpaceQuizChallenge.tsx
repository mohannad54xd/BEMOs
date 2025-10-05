import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


type Difficulty = 'easy' | 'medium' | 'hard';

const SpaceQuizChallenge = () => {
  const [questionCount, setQuestionCount] = useState<number>(5);
  const navigate = useNavigate();

  const handleDifficultySelect = (difficulty: Difficulty) => {
    if (questionCount < 1 || questionCount > 10) {
      alert('Please select a number of questions between 1 and 10');
      return;
    }

    // Store settings and navigate to game
    localStorage.setItem('gameSettings', JSON.stringify({
      difficulty,
      questionCount: Math.min(10, questionCount) // Ensure max 10 questions
    }));

    navigate('/games/quiz/play');
  };

  const difficulties: { type: Difficulty; color: string }[] = [
    { type: 'easy', color: 'from-green-400 to-blue-500' },
    { type: 'medium', color: 'from-yellow-400 to-orange-500' },
    { type: 'hard', color: 'from-red-400 to-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-12 mt-8">
        <motion.h1 
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
          Space Quiz Challenge
        </motion.h1>

        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="backdrop-blur-md bg-white/5 rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map(({ type, color }) => (
                  <motion.button
                    key={type}
                    onClick={() => handleDifficultySelect(type)}
                    className={`px-6 py-3 rounded-xl bg-gradient-to-r ${color} bg-opacity-20 
                      hover:bg-opacity-30 transition-all duration-300 capitalize font-semibold
                      border border-white/10 hover:border-white/20`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {type} Mode
                  </motion.button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-400">
                  Number of Questions:
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={questionCount}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setQuestionCount(Math.min(10, Math.max(1, value)));
                  }}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                />
                <p className="text-sm text-gray-400">Choose between 1 and 10 questions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default SpaceQuizChallenge;
