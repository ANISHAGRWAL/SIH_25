"use client";

import React, { useState } from "react";

interface GameProps {}

// Stress Ball Game - Interactive stress ball
export default function StressBallGame({}: GameProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [squeezeCount, setSqueezeCount] = useState(0);
  const [intensity, setIntensity] = useState(0);

  const handlePress = () => {
    setIsPressed(true);
    setSqueezeCount(prev => prev + 1);
    setIntensity(100);

    setTimeout(() => {
      setIntensity(0);
    }, 200);
  };

  const handleRelease = () => {
    setIsPressed(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 sm:space-y-8 p-4 sm:p-8">
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-gray-700 mb-1 sm:mb-2">Stress Ball Squeeze</div>
        <div className="text-base sm:text-lg text-gray-600">Squeezes: {squeezeCount}</div>
      </div>

      <div className="relative flex items-center justify-center">
        <div
          className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-orange-300 to-red-400 
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
            <div className={`text-5xl sm:text-6xl transition-all ${isPressed ? 'scale-90' : 'scale-100'}`}>
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

      <div className="text-center space-y-1 sm:space-y-2">
        <div className="text-base sm:text-lg font-semibold text-gray-700">
          Click and hold to squeeze
        </div>
        <div className="text-xs sm:text-sm text-gray-600 max-w-sm sm:max-w-md">
          Feel the tension release with each squeeze. Perfect for quick stress relief!
        </div>
      </div>

      {/* Progress indicator */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
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