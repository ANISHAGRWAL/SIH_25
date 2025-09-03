'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

const MOOD_COLORS: Record<string, string> = {
  happy: 'border-green-500',
  sad: 'border-blue-500',
  angry: 'border-red-500',
  surprised: 'border-yellow-400',
  disgusted: 'border-lime-500',
  fearful: 'border-purple-500',
  neutral: 'border-gray-400',
};

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprised: '😮',
  disgusted: '🤢',
  fearful: '😱',
  neutral: '😐',
  error: '😕', // For "no face detected"
};

export default function ExpertSupportPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    loadModels();
    startVideo();
  }, []);

  useEffect(() => {
    if (autoStart) {
      handleStart();
      setAutoStart(false);
    }
  }, [autoStart]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setErrorMsg(null);
      }
    } catch (err) {
      console.error('Webcam error:', err);
    }
  };

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  const detectOnce = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight,
    };

    canvas.width = displaySize.width;
    canvas.height = displaySize.height;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, displaySize.width, displaySize.height);

    faceapi.matchDimensions(canvas, displaySize);

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detection) {
      setErrorMsg("No face detected. Please try again.");
      stopVideo();
      return;
    }

    if (detection.expressions) {
      const expressions = detection.expressions;
      const topMood = Object.entries(expressions).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      setMood(topMood);
      setErrorMsg(null);
    }

    stopVideo();
  };

  const handleStart = async () => {
    setMood(null);
    setErrorMsg(null);
    setIsDetecting(true);
    await startVideo();

    setTimeout(() => {
      detectOnce();
      setIsDetecting(false);
    }, 2000);
  };

  const handleRetake = () => {
    setMood(null);
    setErrorMsg(null);
    canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setAutoStart(true);
  };

  const moodColor = mood
    ? MOOD_COLORS[mood] || 'border-gray-300'
    : errorMsg
    ? 'border-red-500'
    : 'border-gray-300';

  const displayEmoji = mood ? MOOD_EMOJIS[mood] : errorMsg ? MOOD_EMOJIS.error : '';
  const displayMessage = mood ? mood : errorMsg;

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 flex flex-col items-center gap-4 text-center">
      <h2 className="text-xl font-semibold text-gray-900">🎥 Facial Mood Detection</h2>

      <div
        className={`relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border-4 ${moodColor} transition-all duration-500`}
      >
        {mood || errorMsg ? (
          <>
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white px-4">
              <div className="text-6xl">{displayEmoji}</div>
              <div className="text-lg font-semibold capitalize mt-2">{displayMessage}</div>
            </div>
          </>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>

      {!mood && !isDetecting && !errorMsg && (
        <button
          onClick={handleStart}
          className="mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow font-medium transition"
        >
          ▶️ Start Detection
        </button>
      )}

      {isDetecting && (
        <div className="text-blue-600 text-sm mt-2">Detecting mood... Please stay still 🙂</div>
      )}

      {(mood || errorMsg) && (
        <button
          onClick={handleRetake}
          className="mt-4 px-6 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-md shadow font-medium transition"
        >
          🔄 Retake
        </button>
      )}
    </div>
  );
}
