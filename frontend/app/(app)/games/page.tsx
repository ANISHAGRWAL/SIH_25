"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ColorMatchGame from "./components/ColorMatchGame";
import MemoryGame from "./components/MemoryGame";
import DrawingGame from "./components/DrawingGame";
import StressBallGame from "./components/StressBallGame";
import WorryReleaseGame from "./components/WorryReleaseGame";
import FluidSimulationGame from "./components/FluidSimulationGame"; // ✨ New import

// Game Component Props Interface
interface GameComponentProps {
  gameType: string;
  onGameEnd: () => void;
}

interface GameProps {}

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

  return (
    <div className="fixed bottom-2 right-2 z-50 sm:top-10 sm:right-10">
      <audio
        ref={audioRef}
        src="https://audio-previews.elements.envatousercontent.com/files/269472238/preview.mp3"
        preload="auto"
      />
      
      <button
        onClick={toggleMusic}
        className={`group relative overflow-hidden rounded-full p-2.5 transition-all duration-300 ${
          isPlaying 
            ? 'bg-blue-500 hover:bg-blue-600' 
            : 'bg-gray-400 hover:bg-gray-500'
        } text-white shadow-lg`}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        <div className="relative z-10">
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
          )}
        </div>
        
        {/* Ripple effect */}
        <div className={`absolute inset-0 rounded-full bg-white/30 transform scale-0 group-hover:scale-100 transition-transform duration-300`}></div>
      </button>
    </div>
  );
}

// Main Game Component Router
function GameComponent({ gameType, onGameEnd }: GameComponentProps) {
  switch (gameType) {
    case "color-match":
      return <ColorMatchGame />;
    case "memory":
      return <MemoryGame />;
    case "drawing":
      return <DrawingGame />;
    case "stress-ball":
      return <StressBallGame />;
    case "worry-release":
      return <WorryReleaseGame />;
    case "fluid": // ✨ New case
      return <FluidSimulationGame />;
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
  const { isFullscreen, toggleFullscreen, elementRef } = useFullscreen();

  const games = [
    { id: 'color-match', name: 'Color Match', icon: '🎨' },
    { id: 'memory', name: 'Memory Waves', icon: '🌊' },
    { id: 'drawing', name: 'Zen Patterns', icon: '🔮' },
    { id: 'stress-ball', name: 'Stress Ball', icon: '⚾' },
    { id: 'worry-release', name: 'Worry Release', icon: '🕊️' },
    { id: 'fluid', name: 'Liquid Motion', icon: '💧' } // ✨ New game added to the list
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-4 relative">
      {/* Background Music Component - only show when not in fullscreen */}
      {!isFullscreen && <BackgroundMusic />}
      
      <div className="max-w-xl mx-auto sm:max-w-6xl">
        {/* Header - only show when not in fullscreen */}
        {!isFullscreen && (
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              🎵 Stress Relief Games 🎵
            </h1>
            <div className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6">
              Interactive games to help you relax and reduce stress with soothing background music.
            </div>
            <div className="text-xs text-gray-500 bg-white/50 rounded-lg px-2 py-1 inline-block">
              🎧 For best experience, use headphones and adjust music volume.
            </div>
          </div>
        )}

        {/* Game Selector - only show when not in fullscreen */}
        {!isFullscreen && (
          <div className="flex flex-wrap justify-center gap-1 mb-6 sm:gap-2 sm:mb-8">
            {games.map(game => (
              <button
                key={game.id}
                onClick={() => {
                  setSelectedGame(game.id);
                }}
                className={`px-3 py-1 text-sm rounded-xl font-medium transition-all ${
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

        {/* Game Container */}
        <div 
          ref={elementRef}
          className={`bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-3xl border border-gray-200 shadow-xl transition-all duration-300 ${
            isFullscreen 
              ? 'fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-none border-none' 
              : 'p-1 sm:p-3'
          }`}
        >
          {/* Fullscreen Controls */}
          <div className={`${isFullscreen ? 'absolute top-4 left-4 right-4 z-50' : 'mb-4'} flex justify-between items-center`}>
            {isFullscreen && (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Game Selector in Fullscreen */}
                <select
                  value={selectedGame}
                  onChange={(e) => {
                    setSelectedGame(e.target.value);
                  }}
                  className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {games.map(game => (
                    <option key={game.id} value={game.id}>
                      {game.icon} {game.name}
                    </option>
                  ))}
                </select>
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
          <div className={isFullscreen ? 'h-screen pt-12 pb-4' : 'h-[400px] sm:h-[600px]'}>
            <GameComponent
              gameType={selectedGame}
              onGameEnd={() => {}}
            />
          </div>
          
          {/* Background Music Component in Fullscreen */}
          {isFullscreen && (
            <div className="fixed bottom-4 right-4 sm:top-20 sm:right-4 z-50">
              <BackgroundMusic />
            </div>
          )}
        </div>

        {/* Music Attribution - only show when not in fullscreen */}
        {!isFullscreen && (
          <div className="text-center mt-4 text-xs text-gray-400">
            🎵 Background music enhances the relaxation experience
          </div>
        )}
        
        {/* Fullscreen Instructions */}
        {!isFullscreen && (
          <div className="text-center mt-2 text-xs text-gray-500">
            💡 Click the fullscreen button for an immersive gaming experience
          </div>
        )}
      </div>
    </div>
  );
}