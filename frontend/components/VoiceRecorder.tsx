"use client"

import React, { useState, useRef } from 'react';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    audioChunks.current = [];

    recorder.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      // Send to backend
      sendToBackend(audioBlob);
    };
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4">🎤 Voice Mood Detector</h2>

      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded ${
          recording ? 'bg-red-500' : 'bg-green-500'
        } text-white`}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {audioURL && (
        <div className="mt-4">
          <p className="mb-2">🎧 Preview your recording:</p>
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;

// Add this function inside VoiceRecorder component

const sendToBackend = async (audioBlob: Blob) => {
  const formData = new FormData();
  // Backend expects "file" not "audio"
  formData.append("file", audioBlob, "recording.webm");

  try {
    const res = await fetch("http://localhost:8000/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Server Response:", data);
    alert(`Detected Mood: ${data.label || "Unknown"}`);
  } catch (err) {
    console.error("Error uploading audio:", err);
  }
};
