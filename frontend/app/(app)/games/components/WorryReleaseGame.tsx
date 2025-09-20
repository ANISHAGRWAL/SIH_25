"use client";

import React, { useState } from "react";

interface GameProps {}

// Worry Release Game - Write worries that fade away
export default function WorryReleaseGame({}: GameProps) {
  const [worryText, setWorryText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [circleSize, setCircleSize] = useState(250);
  const [showPopup, setShowPopup] = useState(false);
  const [releasedWorries, setReleasedWorries] = useState<string[]>([]);

  const startRelease = () => {
    if (worryText.trim() === '') return;
    
    setIsReleasing(true);
    
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
            setCircleSize(250);
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
    setCircleSize(250);
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
            className="absolute bg-white rounded-full opacity-0 animate-star-drift"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDuration: `${Math.random() * 60 + 20}s`,
              animationDelay: `${Math.random() * 20}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
        
        {/* Nebula clouds */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-80 sm:h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '15s', animationDelay: '5s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 sm:w-64 sm:h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '2s'}}></div>
        
        {/* Spiral Galaxy Arms */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl sm:max-w-4xl max-h-2xl sm:max-h-4xl">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border-2 border-blue-300/20 rounded-full animate-spin-slow"
                style={{
                  animation: `spin-slow ${60 + i * 20}s linear infinite`,
                  transform: `rotate(${i * 45}deg)`,
                  borderRadius: '50%',
                  width: `${150 + i * 75}px`,
                  height: `${150 + i * 75}px`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${75 + i * 37.5}px`,
                  marginTop: `-${75 + i * 37.5}px`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Cosmic Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 mb-2 sm:mb-4 animate-pulse">
            🌌 Cosmic Worry Release 🌌
          </div>
          <div className="text-sm sm:text-xl text-blue-200 font-light mb-2 sm:mb-4">
            Cast your worries into the infinite cosmos
          </div>
        </div>

        {/* Central Galaxy Focus */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Galaxy Center - The destination */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-radial from-white via-yellow-300 to-orange-500 rounded-full animate-pulse-slow shadow-2xl" 
                style={{
                  boxShadow: '0 0 100px rgba(255, 255, 255, 0.5), 0 0 200px rgba(255, 255, 255, 0.3)',
                  animationDuration: '4s'
                }}>
              <div className="absolute inset-2 bg-gradient-radial from-yellow-100 to-transparent rounded-full animate-spin-slow" 
                  style={{animationDuration: '20s'}}></div>
            </div>
          </div>

          {/* Worry Circle */}
          <div className="relative flex items-center justify-center">
            {/* Orbit rings around the worry circle */}
            {!isReleasing && (
              <>
                <div className="absolute inset-0 border border-blue-400/30 rounded-full animate-spin-medium" 
                      style={{ width: `${circleSize + 40}px`, height: `${circleSize + 40}px`, animationDuration: '40s' }}></div>
                <div className="absolute inset-0 border border-purple-400/20 rounded-full animate-spin-medium" 
                      style={{ width: `${circleSize + 60}px`, height: `${circleSize + 60}px`, animationDuration: '60s' }}></div>
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
                    fontSize: `${Math.max(12, circleSize / 15)}px`,
                    width: `${circleSize * 0.75}px`,
                    height: `${circleSize * 0.75}px`,
                    padding: `${Math.max(8, circleSize / 25)}px`,
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
            </div>
          </div>
        </div>

        {/* Cosmic Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-8">
          <button
            onClick={startRelease}
            disabled={worryText.trim() === '' || isReleasing}
            className="px-6 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-pink-600/80 text-white rounded-2xl font-bold text-sm sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500/80 hover:via-purple-500/80 hover:to-pink-500/80 transition-all shadow-2xl border border-blue-400/30 backdrop-blur-sm"
            style={{
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)'
            }}
          >
            {isReleasing ? '🌠 Traveling...' : '🚀 Launch'}
          </button>
          
          <button
            onClick={resetGame}
            className="px-6 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-gray-600/80 to-gray-700/80 text-white rounded-2xl font-bold text-sm sm:text-lg hover:from-gray-500/80 hover:to-gray-600/80 transition-all shadow-2xl border border-gray-400/30 backdrop-blur-sm"
          >
            🔄 New Journey
          </button>
        </div>

        {/* Enhanced Cosmic Success Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90 rounded-3xl p-6 sm:p-12 text-center shadow-2xl max-w-sm sm:max-w-2xl mx-4 border border-blue-400/30 backdrop-blur-md relative overflow-hidden">
              {/* Animated stars in popup */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full animate-star-drift"
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
                <div className="text-5xl sm:text-8xl mb-4 sm:mb-6 animate-bounce">⭐</div>
                <div className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-pink-300 mb-4 sm:mb-6">
                  Worry Absorbed by the Universe!
                </div>
                <div className="text-blue-100 mb-4 sm:mb-8 text-sm sm:text-xl leading-relaxed">
                  Your burden has become stardust, scattered across infinite space. 
                  Feel the cosmic peace flowing through you as your worry transforms into light.
                </div>
                <div className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  ✨ You are one with the cosmos ✨
                </div>
                <div className="mt-4 text-xs sm:text-lg text-purple-200">
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
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes star-drift {
          from { transform: translate(0, 0); opacity: 0.5; }
          to { transform: translate(20px, 20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}