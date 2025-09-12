// components/MusicPlayer.tsx
"use client";
import { useState, useRef } from "react";

interface Track {
  title: string;
  artist?: string;
  file_path: string;
}

export default function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">{currentTrack.title}</h2>
      <audio
        ref={audioRef}
        controls
        autoPlay
        onEnded={playNext}
        src={`/api/music/${currentTrack.file_path}`}
        className="w-full mt-2"
      ></audio>
      <div className="flex gap-2 mt-3">
        {tracks.map((track, i) => (
          <button
            key={i}
            className={`px-3 py-1 text-sm rounded ${
              i === currentTrackIndex ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentTrackIndex(i)}
          >
            {track.title}
          </button>
        ))}
      </div>
    </div>
  );
}
