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
    const newColor = colors[Math.floor(Math.random() * colors.length)].name;
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    setGameState('showing');
    setCurrentShowingIndex(-1);

    // Show sequence with proper timing
    let index = 0;
    const showInterval = setInterval(() => {
      if (index < newSequence.length) {
        setCurrentShowingIndex(index);
        setTimeout(() => setCurrentShowingIndex(-1), 400);
        index++;
      } else {
        clearInterval(showInterval);
        setTimeout(() => {
          setGameState('playing');
          setCurrentShowingIndex(-1);
        }, 600);
      }
    }, 600);
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
    <div className="w-full h-full flex flex-col items-center justify-center sm:p-4">
      {/* Header - Following page.tsx responsive patterns */}
      <div className="text-center mb-2 sm:mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
          Color Harmony
        </h1>
        
        {/* Stats Bar - Similar to page.tsx game selector style */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
          <div className="px-3 py-1 text-sm bg-blue-500 text-white rounded-xl font-medium shadow-lg">
            Level: {level}
          </div>
          <div className="px-3 py-1 text-sm bg-purple-500 text-white rounded-xl font-medium shadow-lg">
            Score: {score}
          </div>
        </div>
        
        {/* Status Text */}
        <div className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6 h-6">
          {getGameStateText()}
        </div>
        
        {/* Instructions Banner - Similar to page.tsx style */}
        <div className="text-xs text-gray-500 bg-white/50 rounded-lg px-2 py-1 inline-block mb-4">
          🎯 Watch the pattern, then repeat it by tapping the colors
        </div>
      </div>

      {/* Game Board - Using page.tsx container styling */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-3xl border border-gray-200 shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 w-full max-w-md">
        {/* Color Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
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
                  w-full min-w-16 min-h-16 sm:min-w-20 sm:min-h-20
                  ${isCurrentlyShowing 
                    ? `${color.active} scale-110 shadow-2xl ring-4 ring-white` 
                    : `${color.bg} ${gameState === 'playing' ? color.hover + ' hover:scale-105' : ''}`
                  }
                  ${gameState !== 'playing' ? 'cursor-default' : 'cursor-pointer'}
                `}
                onClick={() => handleColorClick(color.name)}
                disabled={gameState !== 'playing'}
              />
            );
          })}
        </div>

        {/* Progress Indicators */}
        {sequence.length > 0 && (
          <div className="flex justify-center items-center flex-wrap gap-1 sm:gap-2">
            {sequence.map((color, index) => (
              <div
                key={index}
                className={`
                  w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300
                  ${colors.find(c => c.name === color)?.bg}
                  ${index < playerSequence.length 
                    ? 'opacity-100 scale-110 ring-2 ring-green-400' 
                    : 'opacity-40'
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>

      {/* Control Buttons - Matching page.tsx button styles */}
      <div className="w-full max-w-md space-y-2 sm:space-y-4">
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="w-full px-3 py-2 sm:py-4 text-base sm:text-lg rounded-xl font-medium transition-all bg-blue-500 text-white shadow-lg hover:bg-blue-600 transform hover:scale-105 active:scale-95"
          >
            🎮 Start Game
          </button>
        ) : (
          <div className="space-y-2">
            {gameState === 'gameOver' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-red-200 p-4 mb-4 text-center">
                <div className="text-4xl mb-2">😔</div>
                <p className="text-red-800 font-semibold mb-2">Game Over!</p>
                <p className="text-sm text-red-700">
                  Final Score: <span className="font-semibold">{score}</span> • 
                  Level Reached: <span className="font-semibold">{level}</span>
                </p>
              </div>
            )}
            
            <button
              onClick={startGame}
              className="w-full px-3 py-3 text-base rounded-xl font-medium transition-all bg-green-500 text-white shadow-lg hover:bg-green-600 transform hover:scale-105 active:scale-95"
            >
              {gameState === 'gameOver' ? '🔄 Play Again' : '🆕 New Game'}
            </button>
            
            <button
              onClick={resetGame}
              className="w-full px-3 py-2 text-sm rounded-xl font-medium transition-all bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:scale-105 active:scale-95"
            >
              🏠 Back to Menu
            </button>
          </div>
          
        )}
      </div>

      {/* Tips Section - Similar to page.tsx music attribution style */}
      
    </div>
  );
}