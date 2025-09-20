"use client";

import React, { useState, useEffect } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export default function PixelThoughtsGame() {
  const [thought, setThought] = useState("");
  const [submittedThought, setSubmittedThought] = useState("");
  const [showSun, setShowSun] = useState(true);
  const [sunSize, setSunSize] = useState(160);
  const [isTransforming, setIsTransforming] = useState(false);
  const [backgroundStars, setBackgroundStars] = useState<Star[]>([]);
  const [thoughtStars, setThoughtStars] = useState<Star[]>([]);

  // Generate initial background stars
  useEffect(() => {
    const stars: Star[] = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100 + 100, // Start below screen
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.5 + 0.2,
    }));
    setBackgroundStars(stars);
  }, []);

  // Animate background stars continuously moving upward
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundStars(prev => 
        prev.map(star => {
          let newY = star.y - star.speed;
          // Reset star to bottom when it goes off screen
          if (newY < -10) {
            newY = 110;
          }
          return { ...star, y: newY };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Animate thought stars
  useEffect(() => {
    if (thoughtStars.length > 0) {
      const interval = setInterval(() => {
        setThoughtStars(prev => 
          prev.map(star => ({
            ...star,
            y: star.y - star.speed,
            opacity: star.opacity * 0.995, // Gradually fade
          })).filter(star => star.y > -50 && star.opacity > 0.1)
        );
      }, 50);

      return () => clearInterval(interval);
    }
  }, [thoughtStars]);

  const handleSubmit = () => {
    if (thought.trim() === "") return;
    
    setSubmittedThought(thought);
    setIsTransforming(true);
    
    // Start shrinking the sun faster for quicker stress release
    const shrinkInterval = setInterval(() => {
      setSunSize(prev => {
        const newSize = prev - 12;
        if (newSize <= 8) {
          clearInterval(shrinkInterval);
          // Transform sun into multiple stars
          transformSunToStars();
          return 8;
        }
        return newSize;
      });
    }, 480);

    setThought("");
  };

  const transformSunToStars = () => {
    // Create multiple stars from the sun's position
    const newStars: Star[] = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 20, // Center around sun position
      y: 50 + (Math.random() - 0.5) * 20,
      size: Math.random() * 3 + 2,
      opacity: 1,
      speed: Math.random() * 1 + 0.5,
    }));

    setThoughtStars(prev => [...prev, ...newStars]);

    // Reset after animation - shorter time for faster release
    setTimeout(() => {
      setShowSun(true);
      setSunSize(160);
      setIsTransforming(false);
      setSubmittedThought("");
    }, 4000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black overflow-hidden">
      {/* Background stars moving upward */}
      <div className="absolute inset-0">
        {backgroundStars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.y}%`,
              left: `${star.x}%`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.3)`,
            }}
          />
        ))}
      </div>

      {/* Thought stars (from transformed sun) */}
      <div className="absolute inset-0">
        {thoughtStars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-yellow-200 rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.y}%`,
              left: `${star.x}%`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 3}px rgba(255,255,0,0.5)`,
            }}
          />
        ))}
      </div>

      {/* Central Sun with thought reflection */}
      {showSun && !isTransforming && (
        <div className="flex flex-col items-center relative z-10">
          <div className="relative">
            <div 
              className="rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 animate-pulseGlow transition-all duration-300 ease-out flex items-center justify-center"
              style={{
                width: `${sunSize}px`,
                height: `${sunSize}px`,
                boxShadow: '0 0 60px rgba(255,165,0,0.8), 0 0 100px rgba(255,165,0,0.4)',
              }}
            >
              {/* Thought reflection in the sun */}
              {thought && (
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <span 
                    className="text-orange-900 font-semibold text-center leading-tight opacity-70"
                    style={{
                      fontSize: `${Math.max(10, Math.min(16, sunSize / 12))}px`,
                      maxWidth: `${sunSize * 0.8}px`,
                    }}
                  >
                    {thought.length > 50 ? thought.substring(0, 50) + "..." : thought}
                  </span>
                </div>
              )}
            </div>
          </div>
          <input
            type="text"
            placeholder="What's on your mind?..."
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            onKeyPress={handleKeyPress}
            className="mt-8 w-72 sm:w-80 p-4 rounded-full text-gray-800 text-center outline-none shadow-2xl bg-white/90 backdrop-blur-sm placeholder-gray-500 text-lg"
          />
          <button
            onClick={handleSubmit}
            disabled={!thought.trim()}
            className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            RELEASE
          </button>
        </div>
      )}

      {/* Shrinking Sun Animation with thought reflection */}
      {isTransforming && (
        <div className="flex flex-col items-center relative z-10">
          <div className="relative">
            <div 
              className="rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 transition-all duration-200 ease-out flex items-center justify-center"
              style={{
                width: `${sunSize}px`,
                height: `${sunSize}px`,
                boxShadow: `0 0 ${sunSize}px rgba(255,165,0,0.8)`,
              }}
            >
              {/* Thought reflection during transformation */}
              {submittedThought && sunSize > 20 && (
                <div className="absolute inset-0 flex items-center justify-center px-2">
                  <span 
                    className="text-orange-900 font-semibold text-center leading-tight opacity-60"
                    style={{
                      fontSize: `${Math.max(8, Math.min(14, sunSize / 14))}px`,
                      maxWidth: `${sunSize * 0.9}px`,
                    }}
                  >
                    {submittedThought.length > 40 ? submittedThought.substring(0, 40) + "..." : submittedThought}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}



      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 60px rgba(255,165,0,0.8), 0 0 100px rgba(255,165,0,0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 80px rgba(255,165,0,1), 0 0 120px rgba(255,165,0,0.6);
            transform: scale(1.02);
          }
        }

        .animate-pulseGlow {
          animation: pulseGlow 3s infinite ease-in-out;
        }

        @keyframes fadeOut {
          0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -40px) scale(0.8); }
        }

        .animate-fadeOut {
          animation: fadeOut 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}