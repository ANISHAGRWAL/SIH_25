"use client";
import React, { useEffect, useState, useRef } from "react";
import { StatusDot } from "@/components/status-dot";
import { useAuth } from "@/contexts/AuthContext";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic } from "lucide-react";


// MusicPlayer should not be a default export in the same file
function MusicPlayer() {
  // --- STATE MANAGEMENT ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- PLAYLIST DATA ---
  const playlist = [
    {
      id: 1,
      title: "Forest Rain",
      artist: "Nature Sounds",
      src: "https://www.soundjay.com/misc/sounds/rain-03.wav",
      duration: "5:23",
    },
    {
      id: 2,
      title: "Ocean Waves",
      artist: "Peaceful Sounds",
      src: "https://www.soundjay.com/nature/sounds/ocean-wave-1.wav",
      duration: "8:15",
    },
    {
      id: 3,
      title: "Meditation Bell",
      artist: "Zen Collection",
      src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      duration: "10:00",
    },
    {
      id: 4,
      title: "Wind Chimes",
      artist: "Garden Sounds",
      src: "https://www.soundjay.com/misc/sounds/wind-chimes-1.wav",
      duration: "6:45",
    },
    {
      id: 5,
      title: "Birdsong Dawn",
      artist: "Morning Sounds",
      src: "https://www.soundjay.com/nature/sounds/birds-chirping-1.wav",
      duration: "7:30",
    },
  ];

  const currentTrack = playlist[currentTrackIndex];

  // --- HOOKS FOR AUDIO LOGIC ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // --- CONTROL FUNCTIONS ---
  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const toggleMute = () => setIsMuted(!isMuted);

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
      <div className="rounded-xl bg-white/95 backdrop-blur-sm p-4 space-y-3">
        {/* Top Row: Track Info, Main Controls, Volume */}
        <div className="flex items-center gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
              🎶
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-800 text-md truncate">{currentTrack.title}</h4>
              <p className="text-gray-500 text-sm truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-2">
            <button onClick={prevTrack} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-90" aria-label="Previous track"><SkipBack className="w-5 h-5" /></button>
            <button onClick={togglePlay} className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110 active:scale-95 text-white" aria-label={isPlaying ? "Pause" : "Play"}>{isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}</button>
            <button onClick={nextTrack} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-90" aria-label="Next track"><SkipForward className="w-5 h-5" /></button>
          </div>
          
          {/* Volume & Playlist Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleMute} className="p-2 hover:bg-gray-100 rounded-full" aria-label={isMuted ? "Unmute" : "Mute"}>{isMuted ? <VolumeX className="w-5 h-5 text-gray-600" /> : <Volume2 className="w-5 h-5 text-gray-600" />}</button>
            <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); if (isMuted) setIsMuted(false); }} className="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer music-player-slider" />
            <button onClick={() => setShowPlaylist(!showPlaylist)} className={`p-2 rounded-full transition-colors ${showPlaylist ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`} aria-label="Show playlist"><ListMusic className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-1.5 cursor-pointer group" onClick={handleProgressClick}>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full relative" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}>
              <div className="absolute right-0 top-1/2 -mt-1.5 w-3 h-3 rounded-full bg-white shadow border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Collapsible Playlist */}
        {showPlaylist && (
          <div className="pt-2 border-t border-gray-100 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {playlist.map((track, index) => (
                <div key={track.id} onClick={() => setCurrentTrackIndex(index)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${index === currentTrackIndex ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                  <div className="text-sm font-medium text-gray-400 w-4">{index + 1}</div>
                  <div>
                    <div className={`text-sm font-medium ${index === currentTrackIndex ? 'text-indigo-700' : 'text-gray-800'}`}>{track.title}</div>
                    <div className="text-xs text-gray-500">{track.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <audio ref={audioRef} src={currentTrack.src} preload="metadata" onCanPlayThrough={() => duration === 0 && setDuration(audioRef.current?.duration || 0)} />
    </div>
  );
}


export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user } = useAuth();

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
        <span
          className={`select-none ${sizeClasses} transition-all duration-300`}
        >
          {mood.emoji}
        </span>
      </div>
    );
  };

  return (
    // <ProtectedRoute>
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-xl md:text-2xl font-semibold text-slate-800 animate-slideInDown">
        Welcome {user?.name}
      </h2>

      <section className="space-y-4">
        {/* Mood Selection Card - Full Width */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm hover:shadow-lg transition-all duration-500 ease-out backdrop-blur-sm">
          {!selectedMood ? (
            <div
              className={`transition-all duration-500 ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
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
            <div
              className={`pl-4 transition-all duration-500 ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
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
                <img
                  src="/faceicon.png"
                  alt="Face scan"
                  className="group-hover:scale-110 transition-transform duration-300"
                />
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
                  <img
                    src="/faceicon.png"
                    alt="Face scan"
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Quick facial emotion analysis to understand your current
                    mood
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Mood Check Card */}
          <div
            className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group animate-slideInUp bg-gradient-to-br from-white to-purple-50/30"
            style={{ animationDelay: "100ms" }}
          >
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
                <img
                  src="/mic.png"
                  alt="Voice analysis"
                  className="group-hover:scale-110 transition-transform duration-300"
                />
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
                  <img
                    src="/mic.png"
                    alt="Voice analysis"
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Voice tone analysis to detect emotional patterns - Coming
                    Soon
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mental Detox Card */}
          <div
            onClick={() => (location.href = "/wellness")}
            className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105 group animate-slideInUp bg-gradient-to-br from-white to-green-50/30"
            style={{ animationDelay: "200ms" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                location.href = "/wellness";
              }
            }}
          >
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
                <img
                  src="/yoga.png"
                  alt="Mental wellness"
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Guided stretches and breathing exercises to refresh focus and
                ease stress
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
                  <img
                    src="/yoga.png"
                    alt="Mental wellness"
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Guided stretches and breathing exercises to refresh focus
                    and ease stress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Player Controls */}
        <MusicPlayer />

      </section>
      
      {/* --- STYLES --- */}
      <style jsx>{`
        .music-player-slider::-webkit-slider-thumb { 
            -webkit-appearance: none; 
            appearance: none; 
            width: 14px; 
            height: 14px; 
            border-radius: 50%; 
            background: #64748b; 
            cursor: pointer; 
            margin-top: -5px; 
            transition: background 0.2s; 
        }
        .music-player-slider:hover::-webkit-slider-thumb { 
            background: #475569; 
        }
        .music-player-slider::-moz-range-thumb { 
            width: 14px; 
            height: 14px; 
            border-radius: 50%; 
            background: #64748b; 
            cursor: pointer; 
            border: none; 
        }
        .music-player-slider:hover::-moz-range-thumb { 
            background: #475569; 
        }
        @keyframes fadeIn { 
            from { opacity: 0; } 
            to { opacity: 1; } 
        }
        .animate-fadeIn { 
            animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
          70% {
            transform: scale(0.9);
          }
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