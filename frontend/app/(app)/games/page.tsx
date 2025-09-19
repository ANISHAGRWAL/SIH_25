"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// Game Component Props Interface
interface GameComponentProps {
  gameType: string;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onGameEnd: () => void;
}

interface GameProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

// Background Music Component
function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set audio properties
    audio.volume = volume;
    audio.loop = true;

    // Auto-play when component mounts
    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Audio autoplay prevented by browser');
        setIsPlaying(false);
      }
    };

    playAudio();

    // Cleanup: pause audio when component unmounts
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Audio play failed');
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio
        ref={audioRef}
        src="https://audio-previews.elements.envatousercontent.com/files/269472238/preview.mp3"
        preload="auto"
      />
      
      <div 
        className={`bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 ${
          isExpanded ? 'p-4' : 'p-3'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex items-center gap-3">
          {/* Music Status Indicator */}
          <div className="flex items-center gap-2">
            {isPlaying && (
              <div className="flex items-center gap-1">
                <div className="w-1 h-3 bg-white/80 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
                <div className="w-1 h-4 bg-white/80 rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
                <div className="w-1 h-2 bg-white/80 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
                <div className="w-1 h-4 bg-white/80 rounded-full animate-pulse" style={{animationDelay: '450ms'}}></div>
              </div>
            )}
            
            {/* Play/Pause Button */}
            <button
              onClick={toggleMusic}
              className={`group relative overflow-hidden rounded-full p-2.5 transition-all duration-300 ${
                isPlaying 
                  ? 'bg-white/20 hover:bg-white/30 shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20 shadow-md'
              }`}
              title={isPlaying ? 'Pause Music' : 'Play Music'}
            >
              <div className="relative z-10">
                {isPlaying ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                  </svg>
                )}
              </div>
              
              {/* Ripple effect */}
              <div className={`absolute inset-0 rounded-full bg-white/30 transform scale-0 group-hover:scale-100 transition-transform duration-300`}></div>
            </button>
          </div>
          
          {/* Volume Control - Only show when expanded */}
          <div className={`flex items-center gap-2 transition-all duration-300 ${
            isExpanded ? 'opacity-100 max-w-32' : 'opacity-0 max-w-0 overflow-hidden'
          }`}>
            <svg className="w-4 h-4 text-white/80 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
            </svg>
            
            <div className="relative flex-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{
                  background: `linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              <div 
                className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform -translate-y-1/2 pointer-events-none transition-all duration-200"
                style={{ left: `calc(${volume * 100}% - 6px)` }}
              />
            </div>
            
            <span className="text-xs font-medium text-white/80 min-w-[2rem] text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
        
        {/* Music Label */}
        <div className={`transition-all duration-300 ${
          isExpanded ? 'opacity-100 max-h-8 mt-2' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="text-xs text-white/90 font-medium text-center">
            🎵 {isPlaying ? 'Ambient Relaxation' : 'Music Paused'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Game Component Router
function GameComponent({ gameType, score, setScore, onGameEnd }: GameComponentProps) {
  switch (gameType) {
    case "color-match":
      return <ColorMatchGame score={score} setScore={setScore} />;
    case "memory":
      return <MemoryGame score={score} setScore={setScore} />;
    case "drawing":
      return <DrawingGame score={score} setScore={setScore} />;
    case "stress-ball":
      return <StressBallGame score={score} setScore={setScore} />;
    case "worry-release":
      return <WorryReleaseGame score={score} setScore={setScore} />;
    default:
      return (
        <div className="text-center space-y-6 p-8">
          <div className="text-6xl mb-4">🚧</div>
          <div className="text-2xl font-bold text-gray-700">Coming Soon!</div>
          <div className="text-gray-600 max-w-md">
            This game is currently being developed. Check back soon for an amazing stress-relief experience!
          </div>
        </div>
      );
  }
}

// Color Match Game - Match colors in sequence
function ColorMatchGame({ score, setScore }: GameProps) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [gameState, setGameState] = useState<'waiting' | 'showing' | 'playing'>('waiting');
  const [level, setLevel] = useState(1);

  const colors = [
    { name: 'red', bg: 'bg-red-400', active: 'bg-red-600' },
    { name: 'blue', bg: 'bg-blue-400', active: 'bg-blue-600' },
    { name: 'green', bg: 'bg-green-400', active: 'bg-green-600' },
    { name: 'yellow', bg: 'bg-yellow-400', active: 'bg-yellow-600' },
    { name: 'purple', bg: 'bg-purple-400', active: 'bg-purple-600' },
    { name: 'pink', bg: 'bg-pink-400', active: 'bg-pink-600' }
  ];

  const startNewSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)].name;
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    setGameState('showing');
    setShowSequence(true);

    setTimeout(() => {
      setShowSequence(false);
      setGameState('playing');
    }, newSequence.length * 600 + 500);
  };

  const handleColorClick = (colorName: string) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, colorName];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Wrong color - reset
      setSequence([]);
      setPlayerSequence([]);
      setLevel(1);
      setGameState('waiting');
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      // Sequence complete
      setScore(prev => prev + level * 10);
      setLevel(prev => prev + 1);
      setTimeout(() => {
        startNewSequence();
      }, 1000);
    }
  };

  useEffect(() => {
    if (sequence.length === 0) {
      startNewSequence();
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-8">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-gray-700 mb-2">Color Harmony</div>
        <div className="text-lg text-gray-600">Level {level}</div>
        <div className="text-sm text-gray-500 mt-2">
          {gameState === 'showing' && 'Watch the sequence...'}
          {gameState === 'playing' && 'Repeat the sequence!'}
          {gameState === 'waiting' && 'Get ready...'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {colors.map((color) => (
          <button
            key={color.name}
            className={`w-20 h-20 rounded-full transition-all duration-200 transform hover:scale-105 ${
              showSequence && sequence[playerSequence.length] === color.name
                ? color.active
                : color.bg
            } shadow-lg`}
            onClick={() => handleColorClick(color.name)}
            disabled={gameState !== 'playing'}
          />
        ))}
      </div>

      <div className="flex space-x-2 mt-4">
        {sequence.map((color, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full ${
              colors.find(c => c.name === color)?.bg
            } ${
              index < playerSequence.length ? 'opacity-100' : 'opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Memory Game - Card matching with ocean theme
function MemoryGame({ score, setScore }: GameProps) {
  const [cards, setCards] = useState<Array<{
    id: number;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
  }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const cardValues = ['🐠', '🐙', '🦀', '🐢', '🦈', '🐳', '🐡', '🦞'];

  useEffect(() => {
    const shuffledCards = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffledCards);
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard?.value === secondCard?.value) {
          // Match found
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setScore(prev => prev + 20);
        } else {
          // No match
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-gray-700 mb-2">Memory Waves</div>
        <div className="text-lg text-gray-600">Moves: {moves}</div>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md">
        {cards.map(card => (
          <button
            key={card.id}
            className={`w-16 h-16 rounded-lg transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? 'bg-blue-100 border-2 border-blue-300'
                : 'bg-blue-400 hover:bg-blue-500 border-2 border-blue-600'
            } shadow-lg flex items-center justify-center text-2xl`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.isFlipped || card.isMatched ? card.value : '🌊'}
          </button>
        ))}
      </div>

      {cards.every(card => card.isMatched) && (
        <div className="mt-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">Congratulations!</div>
          <div className="text-gray-600">You completed the memory game in {moves} moves!</div>
        </div>
      )}
    </div>
  );
}

// Drawing Game - Simple mandala creator
function DrawingGame({ score, setScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4F46E5');
  const [brushSize, setBrushSize] = useState(3);

  const colors = ['#4F46E5', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    canvas.width = 400;
    canvas.height = 400;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center point
    ctx.fillStyle = '#E5E7EB';
    ctx.beginPath();
    ctx.arc(200, 200, 2, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    setScore(prev => prev + 1);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#E5E7EB';
    ctx.beginPath();
    ctx.arc(200, 200, 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-700 mb-2">Zen Patterns</div>
        <div className="text-sm text-gray-600">Create beautiful patterns to find inner peace</div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded-lg shadow-lg cursor-crosshair bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {colors.map(c => (
              <button
                key={c}
                className={`w-8 h-8 rounded-full border-2 ${
                  color === c ? 'border-gray-700' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Size:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-16"
            />
          </div>

          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

// Stress Ball Game - Interactive stress ball
function StressBallGame({ score, setScore }: GameProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [squeezeCount, setSqueezeCount] = useState(0);
  const [intensity, setIntensity] = useState(0);

  const handlePress = () => {
    setIsPressed(true);
    setSqueezeCount(prev => prev + 1);
    setScore(prev => prev + 2);
    setIntensity(100);

    setTimeout(() => {
      setIntensity(0);
    }, 200);
  };

  const handleRelease = () => {
    setIsPressed(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-8">
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-700 mb-2">Stress Ball Squeeze</div>
        <div className="text-lg text-gray-600">Squeezes: {squeezeCount}</div>
      </div>

      <div className="relative flex items-center justify-center">
        <div
          className={`w-48 h-48 rounded-full bg-gradient-to-br from-orange-300 to-red-400 
            shadow-2xl cursor-pointer select-none transition-all duration-150 ${
            isPressed ? 'scale-90 shadow-lg' : 'scale-100 shadow-2xl hover:scale-105'
          }`}
          onMouseDown={handlePress}
          onMouseUp={handleRelease}
          onMouseLeave={handleRelease}
          onTouchStart={handlePress}
          onTouchEnd={handleRelease}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-6xl transition-all ${isPressed ? 'scale-90' : 'scale-100'}`}>
              ⚾
            </div>
          </div>
          
          {/* Squeeze effect */}
          {intensity > 0 && (
            <div 
              className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping"
              style={{ animationDuration: '0.3s' }}
            />
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="text-lg font-semibold text-gray-700">
          Click and hold to squeeze
        </div>
        <div className="text-sm text-gray-600 max-w-md">
          Feel the tension release with each squeeze. Perfect for quick stress relief!
        </div>
      </div>

      {/* Progress indicator */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Relaxation Level</span>
          <span>{Math.min(100, squeezeCount * 2)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, squeezeCount * 2)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Worry Release Game - Write worries that fade away
function WorryReleaseGame({ score, setScore }: GameProps) {
  const [worryText, setWorryText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [circleSize, setCircleSize] = useState(300);
  const [showPopup, setShowPopup] = useState(false);
  const [releasedWorries, setReleasedWorries] = useState<string[]>([]);

  const startRelease = () => {
    if (worryText.trim() === '') return;
    
    setIsReleasing(true);
    setScore(prev => prev + 15);
    
    const shrinkInterval = setInterval(() => {
      setCircleSize(prev => {
        const newSize = prev - 1;
        if (newSize <= 0) {
          clearInterval(shrinkInterval);
          setShowPopup(true);
          setReleasedWorries(prev => [...prev, worryText]);
          setWorryText('');
          setIsReleasing(false);
          
          // Reset circle after popup
          setTimeout(() => {
            setShowPopup(false);
            setCircleSize(300);
          }, 3000);
          
          return 0;
        }
        return newSize;
      });
    }, 80);
  };

  const resetGame = () => {
    setWorryText('');
    setIsReleasing(false);
    setCircleSize(300);
    setShowPopup(false);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gray-900">
      {/* Galaxy Background */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-blue-900/50 to-black">
        {/* Stars */}
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
        
        {/* Nebula clouds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Spiral Galaxy Arms */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl max-h-4xl">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border-2 border-blue-300/20 rounded-full animate-spin"
                style={{
                  animation: `spin ${60 + i * 20}s linear infinite`,
                  transform: `rotate(${i * 45}deg)`,
                  borderRadius: '50%',
                  width: `${200 + i * 100}px`,
                  height: `${200 + i * 100}px`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${100 + i * 50}px`,
                  marginTop: `-${100 + i * 50}px`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
        {/* Cosmic Header */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 mb-4 animate-pulse">
            🌌 Cosmic Worry Release 🌌
          </div>
          <div className="text-xl text-blue-200 font-light mb-4">
            Cast your worries into the infinite cosmos
          </div>
        </div>

        {/* Central Galaxy Focus */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Galaxy Center - The destination */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-radial from-white via-yellow-300 to-orange-500 rounded-full animate-pulse shadow-2xl" 
                 style={{
                   boxShadow: '0 0 100px rgba(255, 255, 255, 0.5), 0 0 200px rgba(255, 255, 255, 0.3)',
                   animationDuration: '2s'
                 }}>
              <div className="absolute inset-2 bg-gradient-radial from-yellow-100 to-transparent rounded-full animate-spin" 
                   style={{animationDuration: '10s'}}></div>
            </div>
          </div>

          {/* Worry Circle */}
          <div className="relative flex items-center justify-center">
            {/* Orbit rings around the worry circle */}
            {!isReleasing && (
              <>
                <div className="absolute inset-0 border border-blue-400/30 rounded-full animate-spin" 
                     style={{ width: `${circleSize + 60}px`, height: `${circleSize + 60}px`, animationDuration: '20s' }}></div>
                <div className="absolute inset-0 border border-purple-400/20 rounded-full animate-spin" 
                     style={{ width: `${circleSize + 100}px`, height: `${circleSize + 100}px`, animationDuration: '30s' }}></div>
              </>
            )}
            
            {/* Main Worry Sphere */}
            <div 
              className={`rounded-full flex items-center justify-center transition-all duration-200 relative ${
                isReleasing 
                  ? 'bg-gradient-radial from-blue-400/80 via-purple-400/60 to-transparent' 
                  : 'bg-gradient-radial from-red-400/90 via-orange-400/70 to-yellow-400/50'
              }`}
              style={{ 
                width: `${circleSize}px`, 
                height: `${circleSize}px`,
                opacity: circleSize > 0 ? 1 : 0,
                boxShadow: isReleasing 
                  ? `0 0 ${circleSize/3}px rgba(59, 130, 246, 0.6), inset 0 0 ${circleSize/6}px rgba(255,255,255,0.2)` 
                  : `0 0 ${circleSize/4}px rgba(239, 68, 68, 0.8), inset 0 0 ${circleSize/8}px rgba(255,255,255,0.3)`,
                border: isReleasing ? '2px solid rgba(59, 130, 246, 0.5)' : '2px solid rgba(239, 68, 68, 0.6)'
              }}
            >
              {!isReleasing && (
                <textarea
                  value={worryText}
                  onChange={(e) => setWorryText(e.target.value)}
                  placeholder="Release your burdens to the cosmos..."
                  className="bg-transparent border-none outline-none resize-none text-center text-white font-medium placeholder-blue-200 leading-tight relative z-10"
                  style={{ 
                    fontSize: `${Math.max(16, circleSize / 15)}px`,
                    width: `${circleSize * 0.75}px`,
                    height: `${circleSize * 0.75}px`,
                    padding: `${Math.max(10, circleSize / 25)}px`,
                    textShadow: '0 0 10px rgba(0,0,0,0.8)'
                  }}
                  maxLength={Math.floor(circleSize / 6)}
                />
              )}
              
              {isReleasing && (
                <div 
                  className="text-center text-white font-semibold break-words leading-tight overflow-hidden flex items-center justify-center relative z-10"
                  style={{ 
                    fontSize: `${Math.max(12, circleSize / 18)}px`,
                    width: `${circleSize * 0.8}px`,
                    height: `${circleSize * 0.8}px`,
                    padding: `${Math.max(6, circleSize / 30)}px`,
                    textShadow: '0 0 15px rgba(0,0,0,0.9)',
                    display: '-webkit-box',
                    WebkitLineClamp: Math.max(2, Math.floor(circleSize / 50)),
                    WebkitBoxOrient: 'vertical' as const
                  }}
                >
                  {worryText}
                </div>
              )}

              {/* Cosmic particles streaming toward galaxy center */}
              {isReleasing && (
                <>
                  {[...Array(24)].map((_, i) => {
                    const angle = (i / 24) * 2 * Math.PI;
                    const startX = Math.cos(angle) * (circleSize / 3);
                    const startY = Math.sin(angle) * (circleSize / 3);
                    return (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-300 rounded-full"
                        style={{
                          left: `calc(50% + ${startX}px)`,
                          top: `calc(50% + ${startY}px)`,
                          animation: `moveToCenter 2s ease-in-out infinite`,
                          animationDelay: `${i * 0.1}s`,
                          boxShadow: '0 0 6px rgba(147, 197, 253, 0.8)'
                        }}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cosmic Action Buttons */}
        <div className="flex space-x-6 mb-8">
          <button
            onClick={startRelease}
            disabled={worryText.trim() === '' || isReleasing}
            className="px-10 py-4 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-pink-600/80 text-white rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500/80 hover:via-purple-500/80 hover:to-pink-500/80 transition-all shadow-2xl border border-blue-400/30 backdrop-blur-sm"
            style={{
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)'
            }}
          >
            {isReleasing ? '🌠 Traveling to the Stars...' : '🚀 Launch into the Cosmos'}
          </button>
          
          <button
            onClick={resetGame}
            className="px-10 py-4 bg-gradient-to-r from-gray-600/80 to-gray-700/80 text-white rounded-2xl font-bold text-lg hover:from-gray-500/80 hover:to-gray-600/80 transition-all shadow-2xl border border-gray-400/30 backdrop-blur-sm"
          >
            🔄 New Journey
          </button>
        </div>

        {/* Enhanced Cosmic Success Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90 rounded-3xl p-12 text-center shadow-2xl max-w-2xl mx-4 border border-blue-400/30 backdrop-blur-md relative overflow-hidden">
              {/* Animated stars in popup */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    animationDuration: `${Math.random() * 2 + 1}s`,
                    opacity: Math.random() * 0.7 + 0.3
                  }}
                />
              ))}
              
              <div className="relative z-10">
                <div className="text-8xl mb-6 animate-bounce">⭐</div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-pink-300 mb-6">
                  Worry Absorbed by the Universe!
                </div>
                <div className="text-blue-100 mb-8 text-xl leading-relaxed">
                  Your burden has become stardust, scattered across infinite space. 
                  Feel the cosmic peace flowing through you as your worry transforms into light.
                </div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  ✨ You are one with the cosmos ✨
                </div>
                <div className="mt-6 text-lg text-purple-200">
                  🌟 Inner universe restored 🌟
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes moveToCenter {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-200px, -200px) scale(0); opacity: 0; }
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}

// Fullscreen Hook
function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const enterFullscreen = async () => {
    const element = elementRef.current;
    if (!element) return;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
    } catch (error) {
      console.log('Fullscreen request failed:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.log('Exit fullscreen failed:', error);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement || 
           (document as any).webkitFullscreenElement || 
           (document as any).msFullscreenElement)
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, toggleFullscreen, elementRef };
}

// Demo Component
export default function StressReliefGamesDemo() {
  const [selectedGame, setSelectedGame] = useState('color-match');
  const [score, setScore] = useState(0);
  const { isFullscreen, toggleFullscreen, elementRef } = useFullscreen();

  const games = [
    { id: 'color-match', name: 'Color Match', icon: '🎨' },
    { id: 'memory', name: 'Memory Waves', icon: '🌊' },
    { id: 'drawing', name: 'Zen Patterns', icon: '🔮' },
    { id: 'stress-ball', name: 'Stress Ball', icon: '⚾' },
    { id: 'worry-release', name: 'Worry Release', icon: '🕊️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative">
      {/* Background Music Component - only show when not in fullscreen */}
      {!isFullscreen && <BackgroundMusic />}
      
      <div className="max-w-6xl mx-auto">
        {/* Header - only show when not in fullscreen */}
        {!isFullscreen && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              🎵 Stress Relief Games with Ambient Music 🎵
            </h1>
            <div className="text-lg text-gray-600 mb-6">
              Interactive games designed to help you relax and reduce stress with soothing background music
            </div>
            <div className="text-sm text-gray-500 bg-white/50 rounded-lg px-4 py-2 inline-block">
              🎧 For the best experience, use headphones and adjust the music volume in the top-right corner
            </div>
          </div>
        )}

        {/* Game Selector - only show when not in fullscreen */}
        {!isFullscreen && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {games.map(game => (
              <button
                key={game.id}
                onClick={() => {
                  setSelectedGame(game.id);
                  setScore(0);
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedGame === game.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {game.icon} {game.name}
              </button>
            ))}
          </div>
        )}

        {/* Score Display - only show when not in fullscreen */}
        {!isFullscreen && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
              <span className="text-lg font-semibold text-gray-700">Score:</span>
              <span className="text-xl font-bold text-blue-600">{score}</span>
            </div>
          </div>
        )}

        {/* Game Container */}
        <div 
          ref={elementRef}
          className={`bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl transition-all duration-300 ${
            isFullscreen 
              ? 'fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-none border-none' 
              : 'p-6'
          }`}
        >
          {/* Fullscreen Controls */}
          <div className={`${isFullscreen ? 'absolute top-4 left-4 right-4 z-50' : 'mb-4'} flex justify-between items-center`}>
            {isFullscreen && (
              <div className="flex items-center gap-4">
                {/* Game Selector in Fullscreen */}
                <select
                  value={selectedGame}
                  onChange={(e) => {
                    setSelectedGame(e.target.value);
                    setScore(0);
                  }}
                  className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {games.map(game => (
                    <option key={game.id} value={game.id}>
                      {game.icon} {game.name}
                    </option>
                  ))}
                </select>
                
                {/* Score Display in Fullscreen */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 border border-gray-200 text-sm">
                  <span className="font-semibold text-gray-700">Score: </span>
                  <span className="font-bold text-blue-600">{score}</span>
                </div>
              </div>
            )}
            
            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className={`${
                isFullscreen 
                  ? 'bg-white/90 hover:bg-white text-gray-700' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              } backdrop-blur-sm rounded-lg p-2 transition-all duration-200 border border-gray-300 shadow-sm group`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9V4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5M15 15h4.5M15 15l5.5 5.5" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>

          {/* Game Area */}
          <div className={isFullscreen ? 'h-screen pt-16 pb-4' : 'h-[600px]'}>
            <GameComponent
              gameType={selectedGame}
              score={score}
              setScore={setScore}
              onGameEnd={() => {}}
            />
          </div>
          
          {/* Background Music Component in Fullscreen */}
          {isFullscreen && (
            <div className="fixed top-20 right-4 z-50">
              <BackgroundMusic />
            </div>
          )}
        </div>

        {/* Music Attribution - only show when not in fullscreen */}
        {!isFullscreen && (
          <div className="text-center mt-6 text-xs text-gray-400">
            🎵 Background music enhances the relaxation experience
          </div>
        )}
        
        {/* Fullscreen Instructions */}
        {!isFullscreen && (
          <div className="text-center mt-4 text-sm text-gray-500">
            💡 Click the fullscreen button for an immersive gaming experience
          </div>
        )}
      </div>
    </div>
  );
}