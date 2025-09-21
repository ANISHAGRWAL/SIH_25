"use client";

import React, { useState, useEffect } from "react";

interface GameProps {}

// Color Match Game - Match colors in sequence
export default function ColorMatchGame({}: GameProps) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [currentShowingIndex, setCurrentShowingIndex] = useState(-1);
  const [gameState, setGameState] = useState<'waiting' | 'showing' | 'playing' | 'gameOver'>('waiting');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const colors = [
    { name: 'red', bg: 'bg-red-400', active: 'bg-red-600', hover: 'hover:bg-red-500' },
    { name: 'blue', bg: 'bg-blue-400', active: 'bg-blue-600', hover: 'hover:bg-blue-500' },
    { name: 'green', bg: 'bg-green-400', active: 'bg-green-600', hover: 'hover:bg-green-500' },
    { name: 'yellow', bg: 'bg-yellow-400', active: 'bg-yellow-600', hover: 'hover:bg-yellow-500' },
    { name: 'purple', bg: 'bg-purple-400', active: 'bg-purple-600', hover: 'hover:bg-purple-500' },
    { name: 'pink', bg: 'bg-pink-400', active: 'bg-pink-600', hover: 'hover:bg-pink-500' }
  ];

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setGameState('waiting');
    setGameStarted(true);
    setTimeout(() => startNewSequence(), 500);
  };

  const startNewSequence = () => {
    // Start with easier sequences for beginners
    let newSequence;
    if (level === 1) {
      // Level 1: Always start with just 1 color
      const newColor = colors[Math.floor(Math.random() * 4)].name; // Only use first 4 colors
      newSequence = [newColor];
    } else if (level === 2) {
      // Level 2: 2 colors, still easier colors
      const newColor = colors[Math.floor(Math.random() * 4)].name;
      newSequence = [...sequence, newColor];
    } else if (level <= 4) {
      // Levels 3-4: Use first 4 colors only
      const newColor = colors[Math.floor(Math.random() * 4)].name;
      newSequence = [...sequence, newColor];
    } else {
      // Level 5+: Use all 6 colors
      const newColor = colors[Math.floor(Math.random() * colors.length)].name;
      newSequence = [...sequence, newColor];
    }
    
    setSequence(newSequence);
    setPlayerSequence([]);
    setGameState('showing');
    setCurrentShowingIndex(-1);

    // Slower timing for easier levels
    const baseInterval = level <= 2 ? 1000 : level <= 4 ? 800 : 600;
    const flashDuration = level <= 2 ? 600 : level <= 4 ? 500 : 400;
    const finalPause = level <= 2 ? 1000 : level <= 4 ? 800 : 600;

    // Show sequence with adaptive timing
    let index = 0;
    const showInterval = setInterval(() => {
      if (index < newSequence.length) {
        setCurrentShowingIndex(index);
        setTimeout(() => setCurrentShowingIndex(-1), flashDuration);
        index++;
      } else {
        clearInterval(showInterval);
        setTimeout(() => {
          setGameState('playing');
          setCurrentShowingIndex(-1);
        }, finalPause);
      }
    }, baseInterval);
  };

  const handleColorClick = (colorName: string) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, colorName];
    setPlayerSequence(newPlayerSequence);

    // Check if the clicked color matches the sequence
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Wrong color - game over
      setGameState('gameOver');
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      // Sequence complete - level up
      setScore(prev => prev + level * 10);
      setLevel(prev => prev + 1);
      setTimeout(() => {
        startNewSequence();
      }, 1000);
    }
  };

  const resetGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setGameState('waiting');
    setGameStarted(false);
    setCurrentShowingIndex(-1);
  };

  const getGameStateText = () => {
    switch (gameState) {
      case 'waiting':
        return 'Get ready...';
      case 'showing':
        return 'Watch the sequence...';
      case 'playing':
        return `Repeat the sequence! (${playerSequence.length}/${sequence.length})`;
      case 'gameOver':
        return 'Game Over! Try again?';
      default:
        return '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-2 sm:p-4 lg:p-6 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-3 sm:mb-4 lg:mb-6 w-full max-w-2xl">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 lg:mb-4">
          Color Harmony
        </h1>
        
        {/* Stats Bar - Responsive layout */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base bg-blue-500 text-white rounded-lg sm:rounded-xl font-medium shadow-lg">
            Level: {level}
          </div>
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base bg-purple-500 text-white rounded-lg sm:rounded-xl font-medium shadow-lg">
            Score: {score}
          </div>
        </div>
        
        {/* Status Text */}
        <div className="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 lg:mb-6 h-5 sm:h-6 lg:h-7 flex items-center justify-center">
          {getGameStateText()}
        </div>
        
        {/* Instructions Banner */}
        <div className="text-xs sm:text-sm lg:text-base text-gray-500 bg-white/50 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 inline-block mb-3 sm:mb-4 lg:mb-6">
          🎯 Start easy! Level 1 begins with just 1 color to remember
        </div>
      </div>

      {/* Game Board Container - Improved responsive sizing */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-3xl border border-gray-200 shadow-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 w-full max-w-sm sm:max-w-md lg:max-w-lg">
        {/* Color Grid - Enhanced responsiveness */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
          {colors.map((color) => {
            const isCurrentlyShowing = gameState === 'showing' && 
              currentShowingIndex >= 0 && 
              sequence[currentShowingIndex] === color.name;
            
            return (
              <button
                key={color.name}
                className={`
                  aspect-square rounded-full transition-all duration-200 
                  transform active:scale-95 shadow-lg border-2 border-white
                  w-full 
                  h-16 sm:h-20 lg:h-24
                  ${isCurrentlyShowing 
                    ? `${color.active} scale-110 shadow-2xl ring-4 ring-white` 
                    : `${color.bg} ${gameState === 'playing' ? color.hover + ' hover:scale-105' : ''}`
                  }
                  ${gameState !== 'playing' ? 'cursor-default' : 'cursor-pointer'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                `}
                onClick={() => handleColorClick(color.name)}
                disabled={gameState !== 'playing'}
                aria-label={`${color.name} color button`}
              />
            );
          })}
        </div>


      </div>

      {/* Control Buttons - Improved spacing and sizing */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-2 sm:space-y-3">
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="w-full px-4 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl rounded-xl lg:rounded-2xl font-medium transition-all bg-blue-500 text-white shadow-lg hover:bg-blue-600 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            🎮 Start Game
          </button>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {gameState === 'gameOver' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-red-200 p-3 sm:p-4 lg:p-5 mb-3 sm:mb-4 text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-2">😔</div>
                <p className="text-red-800 font-semibold mb-2 text-sm sm:text-base lg:text-lg">Game Over!</p>
                <p className="text-xs sm:text-sm lg:text-base text-red-700">
                  Final Score: <span className="font-semibold">{score}</span> • 
                  Level Reached: <span className="font-semibold">{level}</span>
                </p>
              </div>
            )}
            
            <button
              onClick={startGame}
              className="w-full px-4 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl rounded-xl lg:rounded-2xl font-medium transition-all bg-green-500 text-white shadow-lg hover:bg-green-600 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {gameState === 'gameOver' ? '🔄 Play Again' : '🆕 New Game'}
            </button>
            
            <button
              onClick={resetGame}
              className="w-full px-4 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg rounded-xl lg:rounded-2xl font-medium transition-all bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              🏠 Back to Menu
            </button>
          </div>
        )}
      </div>

      {/* Responsive spacing at bottom */}
      <div className="h-4 sm:h-6 lg:h-8"></div>
    </div>
  );
}