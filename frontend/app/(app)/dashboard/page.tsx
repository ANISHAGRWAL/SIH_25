"use client";
import React, { useEffect, useState, useRef } from "react";
import { StatusDot } from "@/components/status-dot";
import { useAuth } from "@/contexts/AuthContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
} from "lucide-react";

// MusicPlayer Component
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
    { id: 1, title: "Mind Relaxing Melodies", artist: "Gentle instrumental tracks to calm the mind.", src: "https://audio-previews.elements.envatousercontent.com/files/269472238/preview.mp3", duration: "2:24" },
    { id: 2, title: "Calm & Serene", artist: "Peaceful music to ease anxiety and stress.", src: "https://audio-previews.elements.envatousercontent.com/files/342819361/preview.mp3", duration: "7:17" },
    { id: 3, title: "Inner Peace Sounds", artist: "Music designed for meditation and focus.", src: "https://audio-previews.elements.envatousercontent.com/files/557077988/preview.mp3", duration: "3:49" },
    { id: 4, title: "Stress-Free Harmony", artist: "Relaxing instrumental pieces for mental clarity.", src: "https://audio-previews.elements.envatousercontent.com/files/283217227/preview.mp3", duration: "2:20" },
    { id: 5, title: "Gentle Mind Escape", artist: "A soft retreat for your busy thoughts.", src: "https://audio-previews.elements.envatousercontent.com/files/604850502/preview.mp3", duration: "2:52" },
  ];

  const currentTrack = playlist[currentTrackIndex];

  // --- HOOKS FOR AUDIO LOGIC ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play().catch((e) => console.error("Audio play failed:", e));
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
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-3xl bg-white/90 p-4 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_0_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08),0_0_25px_rgba(0,0,0,0.04)] backdrop-blur-sm">
      <div className="rounded-[calc(1.5rem-4px)] bg-white/95 backdrop-blur-md p-4 md:p-6 space-y-4">
        {/* Top Row: Track Info, Main Controls, Volume */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0 transition-all duration-300 group-hover:scale-105">
              🎶
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-gray-900 text-lg truncate">{currentTrack.title}</h4>
              <p className="text-gray-500 text-sm truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={prevTrack} className="p-3 text-gray-600 hover:bg-gray-100/70 rounded-full transition-all duration-200 active:scale-90" aria-label="Previous track">
              <SkipBack className="w-6 h-6" />
            </button>
            <button onClick={togglePlay} className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 text-white" aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>
            <button onClick={nextTrack} className="p-3 text-gray-600 hover:bg-gray-100/70 rounded-full transition-all duration-200 active:scale-90" aria-label="Next track">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          {/* Volume & Playlist Toggle */}
          <div className="flex items-center gap-2 justify-end">
            <button onClick={toggleMute} className="p-3 hover:bg-gray-100/70 rounded-full transition-colors" aria-label={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <VolumeX className="w-6 h-6 text-gray-600" /> : <Volume2 className="w-6 h-6 text-gray-600" />}
            </button>
            <input
              type="range" min="0" max="1" step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-20 md:w-28 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer music-player-slider"
            />
            <button onClick={() => setShowPlaylist(!showPlaylist)} className={`p-3 rounded-full transition-colors duration-300 ${showPlaylist ? "bg-indigo-100/70 text-indigo-700" : "text-gray-600 hover:bg-gray-100/70"}`} aria-label="Show playlist">
              <ListMusic className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-2 cursor-pointer group" onClick={handleProgressClick}>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full relative transition-all duration-100" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}>
              <div className="absolute right-0 top-1/2 -mt-2 w-4 h-4 rounded-full bg-white shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Collapsible Playlist */}
        {showPlaylist && (
          <div className="pt-4 border-t border-gray-100 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {playlist.map((track, index) => (
                <div key={track.id} onClick={() => { setCurrentTrackIndex(index); setIsPlaying(true); }} className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors duration-200 ${index === currentTrackIndex ? "bg-indigo-100/60 shadow-inner ring-2 ring-indigo-200" : "hover:bg-gray-50/50"}`}>
                  <div className="text-md font-mono text-gray-400 w-6 flex-shrink-0">{index + 1}</div>
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold truncate ${index === currentTrackIndex ? "text-indigo-800" : "text-gray-800"}`}>{track.title}</div>
                    <div className="text-xs text-gray-500 truncate">{track.artist}</div>
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

// Main Dashboard Page Component
export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user } = useAuth();

  const motivationalMessages = {
    stressed: ["This feeling is temporary. Take a deep breath and focus on one thing at a time.", "Acknowledge the stress, but don't let it consume you. You are in control.", "Remember to be kind to yourself. It's okay to take a break.", "Try a short walk or stretch to release tension and reset your mind.", "Focus on what you can control right now, and let go of what you cannot."],
    overwhelmed: ["It's okay to feel overwhelmed. Break your tasks into smaller, manageable steps.", "You don't have to do everything at once. Prioritize what's most important.", "Give yourself permission to pause and recharge. You've got this.", "Make a simple to-do list and tackle one thing at a time.", "Remember, progress is progress, no matter how small each step seems."],
    lonely: ["You are not alone in feeling this way. Reach out to someone you trust.", "This is a good time for self-reflection. What activities bring you comfort?", "Remember that feelings of loneliness will pass. Be patient with yourself.", "Engage in a hobby or activity that brings you joy and connection.", "Consider sending a message or calling a friend; small connections matter."],
    confused: ["It's okay to not have all the answers right now. Clarity will come with time.", "Take a step back and look at the bigger picture. What information are you missing?", "Trust your intuition. Sometimes the best path forward reveals itself slowly.", "Write down your thoughts to organize your mind and identify priorities.", "Ask questions and seek advice from someone you trust; perspectives help."],
    motivated: ["Harness this energy! You're on the right track to achieving great things.", "Your focus is your superpower right now. Keep pushing forward!", "Celebrate your progress, no matter how small. Every step counts.", "Use this momentum to tackle a challenging task you've been avoiding.", "Visualize your goals clearly; motivation grows when purpose is clear."],
    happy: ["Embrace this joy! Let this positive energy guide your day.", "Your happiness is contagious. Share it with others!", "It's wonderful to see you happy. Savor this wonderful feeling.", "Take a moment to reflect on what brought you this happiness today.", "Use this positive energy to spread kindness and encouragement to others."],
  };
  const moods = [
    { key: "stressed", emoji: "😰", label: "Stressed / Anxious" },
    { key: "overwhelmed", emoji: "😩", label: "Overwhelmed / Burnout" },
    { key: "lonely", emoji: "😔", label: "Lonely / Isolated" },
    { key: "confused", emoji: "🤔", label: "Confused / Unsure" },
    { key: "motivated", emoji: "💪", label: "Motivated / Focused" },
    { key: "happy", emoji: "😄", label: "Happy / Content" },
  ];

  const handleMoodClick = (moodKey: string) => {
    setIsTransitioning(true);
    const messages = motivationalMessages[moodKey as keyof typeof motivationalMessages];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setTimeout(() => {
      setSelectedMood(moodKey);
      setCurrentMessage(randomMessage);
      setIsTransitioning(false);
    }, 300);
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
    const sizeClasses = isLarge ? "text-6xl" : "text-4xl md:text-5xl";
    return (
      <div className={`flex items-center justify-center ${!isLarge ? "cursor-pointer hover:scale-110 active:scale-95" : ""} transition-all duration-300 ease-out`}>
        <span className={`select-none ${sizeClasses} transition-all duration-300`}>{mood.emoji}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 animate-slideInDown tracking-tight">
        Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">{user?.name}</span>
      </h2>

      <section className="space-y-6">
        <div className="rounded-3xl bg-white/90 p-6 ring-1 ring-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_0_20px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out hover:shadow-[0_15px_40px_rgba(0,0,0,0.08),0_0_25px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          {!selectedMood ? (
            <div className={`transition-all duration-500 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
              <p className="text-center font-semibold text-slate-700 mb-8 text-lg animate-fadeIn">How are you feeling right now?</p>
              <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap md:flex-nowrap">
                {moods.map((mood, index) => (
                  <button key={mood.key} onClick={() => handleMoodClick(mood.key)} aria-label={mood.label} className={`flex flex-col items-center gap-2 p-4 md:p-5 rounded-xl hover:bg-slate-50/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out border border-transparent hover:border-gray-200 group animate-slideInUp`} style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="group-hover:scale-110 transition-transform duration-300">{renderMoodButton(mood)}</div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-800 transition-colors duration-200">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`transition-all duration-500 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
              {/* UNIFIED RESPONSIVE LAYOUT FOR SELECTED MOOD */}
              <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6 md:gap-8">
                <div className="flex-shrink-0 animate-bounceIn">{renderMoodButton(moods.find((m) => m.key === selectedMood)!, true)}</div>
                <div className="flex-1 animate-slideInRight">
                  <div className="text-lg text-gray-600 mb-3">You said you were feeling <span className="font-bold text-gray-800 animate-pulse">{moods.find((m) => m.key === selectedMood)?.label}</span></div>
                  <p className="text-base text-gray-700 leading-relaxed mb-6 animate-fadeIn">{currentMessage}</p>
                  <div className="flex justify-center md:justify-start gap-4">
                    <button onClick={resetMoodSelection} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-xl transition-all duration-200 font-medium hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
                      Choose Different Mood
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Face Check-In Card - UNIFIED */}
          <div onClick={() => (location.href = "/facial-mood-detection")} className="rounded-3xl bg-white/90 p-6 ring-1 ring-slate-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 group animate-slideInUp bg-gradient-to-br from-white to-blue-50/30" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { location.href = "/facial-mood-detection"; } }}>
            <div className="flex flex-col text-center items-center gap-4 h-full">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-all duration-300 group-hover:shadow-lg">
                <img src="/faceicon.png" alt="Face scan" className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-center w-full mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">Start Face Check-In</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Quick facial emotion analysis to understand your current mood</p>
                <div className="flex justify-center mt-3">
                  <StatusDot status="success" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Voice Mood Check Card - UNIFIED */}
          <div className="rounded-3xl bg-white/90 p-6 ring-1 ring-slate-200 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500 transform hover:-translate-y-2 group animate-slideInUp bg-gradient-to-br from-white to-purple-50/30" style={{ animationDelay: "100ms" }}>
            <div className="flex flex-col text-center items-center gap-4 h-full">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-all duration-300 group-hover:shadow-lg">
                <img src="/mic.png" alt="Voice analysis" className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-center w-full mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">Start Voice Mood Check</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Voice tone analysis to detect emotional patterns - Coming Soon</p>
                <div className="flex justify-center mt-3">
                  <StatusDot status="pending" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Mental Detox Card - UNIFIED */}
          <div onClick={() => (location.href = "/wellness")} className="rounded-3xl bg-white/90 p-6 ring-1 ring-slate-200 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 group animate-slideInUp bg-gradient-to-br from-white to-green-50/30" style={{ animationDelay: "200ms" }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { location.href = "/wellness"; } }}>
            <div className="flex flex-col text-center items-center gap-4 h-full">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-all duration-300 group-hover:shadow-lg">
                <img src="/yoga.png" alt="Mental wellness" className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-center w-full mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors duration-300">5-Minute Mental Detox</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Guided stretches and breathing exercises to refresh focus and ease stress</p>
                <div className="flex justify-center mt-3">
                  <StatusDot status="pending" />
                </div>
              </div>
            </div>
          </div>

          {/* Fun Zone Card - NEW */}
          <div onClick={() => (location.href = "/games")} className="rounded-3xl bg-white/90 p-6 ring-1 ring-slate-200 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 group animate-slideInUp bg-gradient-to-br from-white to-orange-50/30" style={{ animationDelay: "300ms" }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { location.href = "/game"; } }}>
            <div className="flex flex-col text-center items-center gap-4 h-full">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-all duration-300 group-hover:shadow-lg">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">🎮</div>
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-center w-full mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors duration-300">Fun Zone</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Interactive games and activities to boost your mood and have fun</p>
                <div className="flex justify-center mt-3">
                  <StatusDot status="success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <MusicPlayer />
      </section>

      {/* Styles */}
      <style jsx>{`
        /* Custom styles for the volume slider to match the theme */
        .music-player-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #6366f1; /* Indigo-500 */
          border-radius: 9999px;
          cursor: pointer;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .music-player-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .music-player-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #6366f1; /* Indigo-500 */
          border-radius: 9999px;
          cursor: pointer;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .music-player-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
        /* Custom animations for a smoother feel */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.9); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideInUp { animation: slideInUp 0.5s ease-out forwards; }
        .animate-slideInDown { animation: slideInUp 0.5s ease-out backwards; } /* Reusing slideInUp but with a different direction */
        .animate-slideInRight { animation: slideInRight 0.5s ease-out forwards; }
        .animate-bounceIn { animation: bounceIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}