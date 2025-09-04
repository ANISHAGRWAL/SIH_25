"use client";
import React, { useState } from "react";
import { StatusDot } from "@/components/status-dot";
import ExpertSupportPage from "../expert-support/page";

export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");

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
    { key: "happy", emoji: "😊", label: "Happy", color: "bg-yellow-100 hover:bg-yellow-200" },
    { key: "neutral", emoji: "😐", label: "Neutral", color: "bg-gray-100 hover:bg-gray-200" },
    { key: "sad", emoji: "😢", label: "Sad", color: "bg-blue-100 hover:bg-blue-200" },
    { key: "angry", emoji: "😠", label: "Angry", color: "bg-red-100 hover:bg-red-200" },
    { key: "fearful", emoji: "😰", label: "Fearful", color: "bg-purple-100 hover:bg-purple-200" },
    { key: "disgusted", emoji: "🤢", label: "Disgusted", color: "bg-green-100 hover:bg-green-200" },
  ];

  const handleMoodClick = (moodKey: string) => {
    const messages = motivationalMessages[moodKey as keyof typeof motivationalMessages];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setSelectedMood(moodKey);
    setCurrentMessage(randomMessage);
  };

  const getAnotherMessage = () => {
    if (selectedMood) {
      const messages = motivationalMessages[selectedMood as keyof typeof motivationalMessages];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
    }
  };

  const resetMoodSelection = () => {
    setSelectedMood(null);
    setCurrentMessage("");
  };

  const renderMoodButton = (mood: any, isLarge = false) => {
    const sizeClasses = isLarge 
      ? "text-8xl" 
      : "text-5xl md:text-6xl";
    
    return (
      <div className={`flex items-center justify-center ${!isLarge ? 'cursor-pointer hover:scale-110 active:scale-95' : ''} transition-all duration-200`}>
        <span className={`select-none ${sizeClasses}`}>
          {mood.emoji}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Welcome Amar,</h2>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="col-span-3 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          {!selectedMood ? (
            <>
              <p className="text-center font-medium text-slate-700 mb-6 text-lg">
                How are you feeling right now?
              </p>
              <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                {moods.map((mood) => (
                  <button
                    key={mood.key}
                    onClick={() => handleMoodClick(mood.key)}
                    aria-label={mood.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-300"
                  >
                    {renderMoodButton(mood)}
                    <span className="text-sm font-medium text-slate-600">{mood.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="pl-4">
              <div className="hidden md:flex items-start gap-6">
                <div className="flex-shrink-0">
                  {renderMoodButton(moods.find((m) => m.key === selectedMood)!, true)}
                </div>
                
                <div className="flex-1">
                  <div className="text-base text-gray-600 mb-3">
                    You said you were feeling{" "}
                    <span className="font-bold text-gray-800">
                      {moods.find((m) => m.key === selectedMood)?.label}
                    </span>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    {currentMessage}
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={resetMoodSelection}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors font-medium"
                    >
                      Choose Different Mood
                    </button>
                  </div>
                </div>
              </div>

              <div className="md:hidden flex flex-col items-center text-center">
                <div className="mb-4">
                  {renderMoodButton(moods.find((m) => m.key === selectedMood)!, true)}
                </div>
                
                <div className="w-full">
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
                      onClick={getAnotherMessage}
                      className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg transition-colors font-medium"
                    >
                      Another Message
                    </button>
                    <button
                      onClick={resetMoodSelection}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors font-medium"
                    >
                      Change Mood
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="font-medium">Start Face Check-In</p>
            <StatusDot status="success" />
          </div>
          <div className="mt-3 h-28 rounded-xl bg-slate-50 flex items-center justify-center">
            <span className="text-slate-400">Face scan placeholder</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="font-medium">Start Voice Mood Check</p>
            <StatusDot status="pending" />
          </div>
          <div className="mt-3 h-28 rounded-xl bg-slate-50 flex items-center justify-center">
            <span className="text-slate-400">Microphone placeholder</span>
          </div>
        </div>

        <div className="col-span-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="h-24 rounded-xl flex items-center justify-center gap-4 px-6">
            <button
              className="size-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              aria-label="Play"
            >
              ▶
            </button>
            <button
              className="size-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              aria-label="Pause"
            >
              ⏸
            </button>
            <button
              className="size-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              aria-label="Next"
            >
              »
            </button>
          </div>
        </div>

        <div className="col-span-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/woman-in-nature-yoga.png" alt="" className="h-12 w-12" />
            <div>
              <p className="font-semibold">Your 5-minute mental detox</p>
              <p className="text-sm text-slate-600">
                Guided stretches to refresh focus and ease stress.
              </p>
            </div>
          </div>
          <button className="rounded-full px-4 py-2 bg-slate-800 text-white">
            Start Now
          </button>
        </div>
        <h1 onClick={() => (location.href = "/facial-mood-detection")}>
          facial-mood-detection
        </h1>
      </section>
    </div>
  );
}