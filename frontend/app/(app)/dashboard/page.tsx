"use client";
import React, { useState } from "react";
import { StatusDot } from "@/components/status-dot";
import ExpertSupportPage from "../expert-support/page";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const motivationalMessages = {
    happy: [
      "It's wonderful to see you happy! Let this positive energy guide your day.",
      "Your happiness is shining through. Keep embracing this wonderful feeling!",
      "Great to see you in high spirits! What's one thing you can do to share this joy?",
      "Happiness looks great on you! May this feeling stay with you throughout the day.",
      "Embrace this joy! You deserve every bit of this happiness.",
    ],
    neutral: [
      "Feeling neutral is a state of calm and balance. It's a perfect moment for clarity.",
      "This is a moment of peace. Take a deep breath and center yourself.",
      "A neutral state is a great foundation. From here, you can choose where you want to go.",
      "It's okay to just be. This calmness is a form of self-care.",
      "You are in a stable place. Use this clarity to plan your next step.",
    ],
    sad: [
      "It's okay to feel sad. Allow yourself this moment. These feelings are valid and will pass.",
      "Be gentle with yourself today. Your feelings are a natural part of being human.",
      "Remember that even after the heaviest rain, the sun shines again. You are not alone.",
      "This feeling is temporary. You have the strength to navigate through it.",
      "Allow yourself to feel this, but know that brighter days are ahead. You've got this.",
    ],
    angry: [
      "Your feelings of anger are valid. Take a moment to breathe and understand its source.",
      "Anger can be a powerful signal. What is it telling you right now?",
      "It's okay to feel angry. Channel this energy into something constructive when you're ready.",
      "Take a step back and a deep breath. You are in control, not the anger.",
      "This feeling will subside. Focus on finding your calm and releasing the tension.",
    ],
    fearful: [
      "It's natural to feel fear. Acknowledge it without letting it take over. You are safe.",
      "This feeling of fear is just a visitor; it doesn't have to stay. Breathe through it.",
      "You are stronger than your fears. Take one small, brave step at a time.",
      "Focus on the present moment. In this breath, you are okay.",
      "Acknowledge your fear, and then remind yourself of your strength and resilience.",
    ],
    disgusted: [
      "It's okay to feel this way in response to something unpleasant. This feeling will pass.",
      "Your reaction is a sign of your values. Let it go and focus on what brings you peace.",
      "Take a moment to cleanse your mind. Think of something beautiful and pure.",
      "This feeling doesn't define your day. Shift your focus to something that makes you feel good.",
      "Release this negative feeling. You deserve to feel calm and at ease.",
    ],
  };

  const moods = [
    {
      key: "happy",
      emoji: "😊",
      label: "Happy",
      color: "bg-yellow-100 hover:bg-yellow-200",
      gradient: "from-yellow-50 to-amber-50",
      shadow: "shadow-yellow-100",
    },
    {
      key: "neutral",
      emoji: "😐",
      label: "Neutral",
      color: "bg-gray-100 hover:bg-gray-200",
      gradient: "from-gray-50 to-slate-50",
      shadow: "shadow-gray-100",
    },
    {
      key: "sad",
      emoji: "😢",
      label: "Sad",
      color: "bg-blue-100 hover:bg-blue-200",
      gradient: "from-blue-50 to-indigo-50",
      shadow: "shadow-blue-100",
    },
    {
      key: "angry",
      emoji: "😠",
      label: "Angry",
      color: "bg-red-100 hover:bg-red-200",
      gradient: "from-red-50 to-rose-50",
      shadow: "shadow-red-100",
    },
    {
      key: "fearful",
      emoji: "😰",
      label: "Fearful",
      color: "bg-purple-100 hover:bg-purple-200",
      gradient: "from-purple-50 to-violet-50",
      shadow: "shadow-purple-100",
    },
    {
      key: "disgusted",
      emoji: "🤢",
      label: "Disgusted",
      color: "bg-green-100 hover:bg-green-200",
      gradient: "from-green-50 to-emerald-50",
      shadow: "shadow-green-100",
    },
  ];

  const handleMoodClick = (moodKey: string) => {
    setIsTransitioning(true);
    const messages =
      motivationalMessages[moodKey as keyof typeof motivationalMessages];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Delay to show transition effect
    setTimeout(() => {
      setSelectedMood(moodKey);
      setCurrentMessage(randomMessage);
      setIsTransitioning(false);
    }, 300);
  };

  const getAnotherMessage = () => {
    if (selectedMood) {
      const messages =
        motivationalMessages[selectedMood as keyof typeof motivationalMessages];
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
    }
  };

  const resetMoodSelection = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedMood(null);
      setCurrentMessage("");
      setIsTransitioning(false);
    }, 200);
  };

  const renderMoodButton = (mood: any, isLarge = false) => {
    const sizeClasses = isLarge ? "text-8xl" : "text-5xl md:text-6xl";

    return (
      <div
        className={`flex items-center justify-center ${
          !isLarge ? "cursor-pointer hover:scale-110 active:scale-95" : ""
        } transition-all duration-300 ease-out`}
      >
        <span className={`select-none ${sizeClasses} transition-all duration-300`}>{mood.emoji}</span>
      </div>
    );
  };

  return (
    // <ProtectedRoute>
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl md:text-2xl font-semibold text-slate-800 animate-slideInDown">
        Welcome Amar,
      </h2>

      <section className="space-y-4">
        {/* Mood Selection Card - Full Width */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm hover:shadow-lg transition-all duration-500 ease-out backdrop-blur-sm">
          {!selectedMood ? (
            <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <p className="text-center font-medium text-slate-700 mb-6 text-lg animate-fadeIn">
                How are you feeling right now?
              </p>
              <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                {moods.map((mood, index) => (
                  <button
                    key={mood.key}
                    onClick={() => handleMoodClick(mood.key)}
                    aria-label={mood.label}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out border border-transparent hover:border-white/50 group animate-slideInUp`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {renderMoodButton(mood)}
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-800 transition-colors duration-200">
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`pl-4 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="hidden md:flex items-start gap-6">
                <div className="flex-shrink-0 animate-bounceIn">
                  {renderMoodButton(
                    moods.find((m) => m.key === selectedMood)!,
                    true
                  )}
                </div>

                <div className="flex-1 animate-slideInRight">
                  <div className="text-base text-gray-600 mb-3">
                    You said you were feeling{" "}
                    <span className="font-bold text-gray-800 animate-pulse">
                      {moods.find((m) => m.key === selectedMood)?.label}
                    </span>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed mb-4 animate-fadeIn">
                    {currentMessage}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={resetMoodSelection}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-all duration-200 font-medium hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Choose Different Mood
                    </button>
                  </div>
                </div>
              </div>

              <div className="md:hidden flex flex-col items-center text-center">
                <div className="mb-4 animate-bounceIn">
                  {renderMoodButton(
                    moods.find((m) => m.key === selectedMood)!,
                    true
                  )}
                </div>

                <div className="w-full animate-slideInUp">
                  <div className="text-base text-gray-600 mb-3">
                    You said you were feeling{" "}
                    <span className="font-bold text-gray-800">
                      {moods.find((m) => m.key === selectedMood)?.label}
                    </span>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    {currentMessage}
                  </p>

                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={resetMoodSelection}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-all duration-200 font-medium hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Change Mood
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Three Feature Cards - Mobile: Stack Vertically, Desktop: Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Face Check-In Card */}
          <div
            onClick={() => (location.href = "/facial-mood-detection")}
            className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105 group animate-slideInUp bg-gradient-to-br from-white to-blue-50/30"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                location.href = "/facial-mood-detection";
              }
            }}
          >
            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  Start Face Check-In
                </h3>
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <StatusDot status="success" />
                </div>
              </div>
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-all duration-300 group-hover:shadow-lg">
                <img src="/faceicon.png" alt="Face scan" className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Quick facial emotion analysis to understand your current mood
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  Start Face Check-In
                </h3>
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <StatusDot status="success" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-all duration-300 group-hover:shadow-lg">
                  <img src="/faceicon.png" alt="Face scan" className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Quick facial emotion analysis to understand your current mood
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Mood Check Card */}
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group animate-slideInUp bg-gradient-to-br from-white to-purple-50/30" style={{ animationDelay: '100ms' }}>
            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                  Start Voice Mood Check
                </h3>
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <StatusDot status="pending" />
                </div>
              </div>
              <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-all duration-300 group-hover:shadow-lg">
                <img src="/mic.png" alt="Voice analysis" className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Voice tone analysis to detect emotional patterns - Coming Soon
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                  Start Voice Mood Check
                </h3>
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <StatusDot status="pending" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-all duration-300 group-hover:shadow-lg">
                  <img src="/mic.png" alt="Voice analysis" className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Voice tone analysis to detect emotional patterns - Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mental Detox Card */}
          <div  onClick={() => (location.href = "/wellness")}
            className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105 group animate-slideInUp bg-gradient-to-br from-white to-green-50/30"
            style={{ animationDelay: '200ms' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                location.href = "/wellness";
              }
            }}>
            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                  5-Minute Mental Detox
                </h3>
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <StatusDot status="pending" />
                </div>
              </div>
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-all duration-300 group-hover:shadow-lg">
                <img src="/yoga.png" alt="Mental wellness" className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Guided stretches and breathing exercises to refresh focus and ease stress
              </p>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                  5-Minute Mental Detox
                </h3>
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <StatusDot status="pending" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-all duration-300 group-hover:shadow-lg">
                  <img src="/yoga.png" alt="Mental wellness" className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Guided stretches and breathing exercises to refresh focus and ease stress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Player Controls */}
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 hover:shadow-lg transition-all duration-300 animate-slideInUp bg-gradient-to-r from-white to-slate-50/50" style={{ animationDelay: '300ms' }}>
          <div className="h-24 rounded-xl flex items-center justify-center gap-6 px-6">
            <button
              className="size-12 rounded-full bg-white shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:scale-110 active:scale-95 hover:-translate-y-1"
              aria-label="Play"
            >
              <span className="text-lg">▶</span>
            </button>
            <button
              className="size-12 rounded-full bg-white shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:scale-110 active:scale-95 hover:-translate-y-1"
              aria-label="Pause"
            >
              <span className="text-lg">⏸</span>
            </button>
            <button
              className="size-12 rounded-full bg-white shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:scale-110 active:scale-95 hover:-translate-y-1"
              aria-label="Next"
            >
              <span className="text-lg">»</span>
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% { transform: scale(0.9); }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideInDown {
          animation: slideInDown 0.8s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out;
          animation-fill-mode: both;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 1s ease-out;
        }
      `}</style>
    </div>
    // </ProtectedRoute>
  );
}