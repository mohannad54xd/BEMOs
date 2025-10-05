import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/SpaceAdventure.css';

const ships = [
  {
    id: 1,
    name: "Fighter",
    color: "#4CAF50",
    path: "M50 0 L80 80 L50 100 L20 80 Z"
  },
  {
    id: 2,
    name: "Scout",
    color: "#2196F3",
    path: "M20 80 L50 0 L80 80 L50 60 Z"
  },
  {
    id: 3,
    name: "Destroyer",
    color: "#9C27B0",
    path: "M10 80 L50 0 L90 80 L50 70 Z"
  }
];

const SpaceAdventure = () => {
  const [gameState, setGameState] = useState<{
    isPlaying: boolean;
    score: number;
    health: number;
    selectedShip: number | null;
  }>({
    isPlaying: false,
    score: 0,
    health: 100,
    selectedShip: null
  });

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [enemies, setEnemies] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [projectiles, setProjectiles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const handleShipSelect = (shipId: number) => {
    setGameState(prev => ({ ...prev, selectedShip: shipId }));
  };

  const handleStartGame = () => {
    if (!gameState.selectedShip) return;
    setGameState(prev => ({ ...prev, isPlaying: true, score: 0, health: 100 }));
    setPosition({ 
      x: window.innerWidth / 2 - 25,
      y: window.innerHeight - 100 
    });
    setEnemies([]);
    setProjectiles([]);
  };


  const shoot = () => {
    if (!gameState.isPlaying) return;
    setProjectiles(prev => [
      ...prev,
      { id: Date.now(), x: position.x, y: position.y }
    ]);
  };

  const spawnEnemy = () => {
    if (!gameState.isPlaying) return;
    setEnemies(prev => [
      ...prev,
      {
        id: Date.now(),
        x: Math.random() * (window.innerWidth - 50),
        y: -50
      }
    ]);
  };

  useEffect(() => {
    if (!gameState.isPlaying) return;

    const spawnInterval = setInterval(spawnEnemy, 2000);
    return () => clearInterval(spawnInterval);
  }, [gameState.isPlaying]);

  useEffect(() => {
    const moveEnemies = () => {
      setEnemies(prev => 
        prev
          .map(enemy => ({ ...enemy, y: enemy.y + 2 }))
          .filter(enemy => {
            if (enemy.y > window.innerHeight) {
              setGameState(prev => ({
                ...prev,
                health: Math.max(0, prev.health - 10)
              }));
              return false;
            }
            return true;
          })
      );
    };

    const moveProjectiles = () => {
      setProjectiles(prev => 
        prev
          .map(proj => ({ ...proj, y: proj.y - 5 }))
          .filter(proj => proj.y > 0)
      );
    };

    const checkCollisions = () => {
      projectiles.forEach(proj => {
        enemies.forEach(enemy => {
          const distance = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
          if (distance < 30) {
            setEnemies(prev => prev.filter(e => e.id !== enemy.id));
            setProjectiles(prev => prev.filter(p => p.id !== proj.id));
            setGameState(prev => ({ ...prev, score: prev.score + 10 }));
          }
        });
      });
    };

    const gameLoop = () => {
      if (!gameState.isPlaying) return;
      if (gameState.health <= 0) {
        setGameState(prev => ({ ...prev, isPlaying: false }));
        return;
      }

      moveEnemies();
      moveProjectiles();
      checkCollisions();
      frameRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameState.isPlaying) {
      frameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.health, enemies, projectiles]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying) return;
      // normalize key detection and prevent default to avoid page scroll
      const key = e.key;
      const code = (e as any).code || '';

      if (code === 'Space' || key === ' ' || key === 'Spacebar') {
        e.preventDefault();
        shoot();
        return;
      }

      if (key === 'ArrowLeft' || key === 'Left') {
        e.preventDefault();
        setPosition(prev => ({
          ...prev,
          x: Math.max(0, prev.x - 20)
        }));
        return;
      }

      if (key === 'ArrowRight' || key === 'Right') {
        e.preventDefault();
        setPosition(prev => ({
          ...prev,
          x: Math.min(window.innerWidth - 50, prev.x + 20)
        }));
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying]);

  // Add touch controls
  useEffect(() => {
    if (!gameState.isPlaying) return;

    let touchStartX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const diff = touch.clientX - touchStartX;
      setPosition(prev => ({
        ...prev,
        x: Math.max(0, Math.min(window.innerWidth - 50, prev.x + diff))
      }));
      touchStartX = touch.clientX;
    };

    const handleTouchEnd = () => {
      shoot();
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState.isPlaying]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8 h-screen" ref={gameRef}>
        <AnimatePresence>
          {!gameState.isPlaying ? (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center space-y-8 backdrop-blur-md bg-white/5 p-8 rounded-2xl">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Space Adventure
                </h2>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {ships.map((ship) => (
                    <motion.button
                      key={ship.id}
                      onClick={() => handleShipSelect(ship.id)}
                      className={`p-4 rounded-xl transition-all ${
                        gameState.selectedShip === ship.id 
                          ? 'bg-white/20 border-2 border-purple-500' 
                          : 'bg-white/5 border border-white/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-16 h-16 mx-auto mb-2">
                        <svg viewBox="0 0 100 100">
                          <path d={ship.path} fill={ship.color} />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-300">{ship.name}</p>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={handleStartGame}
                  disabled={!gameState.selectedShip}
                  className={`px-8 py-3 rounded-full ${
                    gameState.selectedShip
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30'
                      : 'bg-gray-500/20 cursor-not-allowed'
                  }`}
                  whileHover={gameState.selectedShip ? { scale: 1.05 } : {}}
                  whileTap={gameState.selectedShip ? { scale: 0.95 } : {}}
                >
                  {gameState.selectedShip ? 'Start Game' : 'Select a Ship'}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="fixed top-4 left-4 z-20 space-x-4">
                <span className="text-green-400">Health: {gameState.health}</span>
                <span className="text-blue-400">Score: {gameState.score}</span>
              </div>

              <motion.div
                className="absolute w-12 h-12"
                style={{ 
                  left: `${position.x}px`,
                  bottom: "100px"
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d={ships.find(s => s.id === gameState.selectedShip)?.path || ships[0].path}
                    fill={ships.find(s => s.id === gameState.selectedShip)?.color || ships[0].color}
                    className="drop-shadow-[0_0_10px_rgba(76,175,80,0.5)]"
                  />
                </svg>
              </motion.div>

              {projectiles.map(proj => (
                <motion.div
                  key={proj.id}
                  className="absolute w-2 h-6 bg-blue-500 rounded-full"
                  style={{ left: proj.x + 23, top: proj.y }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              ))}

              {enemies.map(enemy => (
                <motion.div
                  key={enemy.id}
                  className="absolute w-10 h-10"
                  style={{ left: enemy.x, top: enemy.y }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M50 20 L70 45 L60 80 L40 80 L30 45 Z"
                      fill="#FF4081"
                      className="drop-shadow-[0_0_10px_rgba(255,64,129,0.5)]"
                    />
                  </svg>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SpaceAdventure;
