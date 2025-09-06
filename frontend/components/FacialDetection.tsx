"use client";

import { getCameraInput } from "@/utils/getCameraInput";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";

// The MOOD_DATA object is unchanged as it provides the core logic and content.
const MOOD_DATA = {
  happy: { color: "border-emerald-400 bg-emerald-50", emoji: "😊", desc: "You're looking great! Positive vibes detected." },
  sad: { color: "border-blue-400 bg-blue-50", emoji: "😢", desc: "It seems you might be feeling down. That's okay." },
  angry: { color: "border-red-400 bg-red-50", emoji: "😠", desc: "You appear frustrated. Take a deep breath." },
  surprised: { color: "border-amber-400 bg-amber-50", emoji: "😮", desc: "Something caught your attention! Interesting." },
  disgusted: { color: "border-lime-400 bg-lime-50", emoji: "🤢", desc: "You seem uncomfortable with something." },
  fearful: { color: "border-purple-400 bg-purple-50", emoji: "😱", desc: "You look worried. Everything will be alright." },
  neutral: { color: "border-slate-400 bg-slate-50", emoji: "😐", desc: "You appear calm and composed." },
  error: { color: "border-red-400 bg-red-50", emoji: "😕", desc: "" }
};

export default function ExpertSupportPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'complete' | 'incomplete'>('idle');

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    loadModels();

    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.matchMedia('(display-mode: standalone)').matches ||
        window.innerWidth < 1024 ||
        window.matchMedia('(max-width: 1024px)').matches;
    };

    setIsFullScreen(checkMobile());

    const handleResize = () => {
      setIsFullScreen(checkMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (autoStart) {
      handleStart();
      setAutoStart(false);
    }
  }, [autoStart]);

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const handleStart = async () => {
    setMood(null);
    setErrorMsg(null);
    setIsDetecting(true);
    setDetectionStatus('idle');

    const input = await getCameraInput();
    if (!input) {
      setErrorMsg("Unable to access camera.");
      setIsDetecting(false);
      setDetectionStatus('incomplete');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      setErrorMsg("Canvas not available.");
      setIsDetecting(false);
      setDetectionStatus('incomplete');
      return;
    }

    const processDetection = async (imageSource: HTMLVideoElement | HTMLImageElement) => {
      const detection = await faceapi
        .detectSingleFace(imageSource, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detection) {
        setErrorMsg("No face detected. Please try again.");
        setDetectionStatus('incomplete');
      } else {
        const topMood = Object.entries(detection.expressions!).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        setMood(topMood);
        setDetectionStatus('complete');
      }
      setIsDetecting(false);
    };

    if (input instanceof MediaStream) {
      if (videoRef.current) {
        videoRef.current.srcObject = input;
        setTimeout(async () => {
          const video = videoRef.current;
          if (video) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            faceapi.matchDimensions(canvas, { width: canvas.width, height: canvas.height });
            await processDetection(video);
            stopVideo();
          }
        }, 2000);
      }
    } else if (typeof input === "string") {
      const img = new Image();
      img.src = input;
      img.onload = async () => {
        await img.decode();
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        faceapi.matchDimensions(canvas, { width: img.width, height: img.height });
        await processDetection(img);
      };
    }
  };

  const handleRetake = () => {
    setMood(null);
    setErrorMsg(null);
    setDetectionStatus('idle');
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setAutoStart(true);
  };

  const handleCloseResult = () => {
    setMood(null);
    setErrorMsg(null);
    setDetectionStatus('idle');
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const currentData = mood ? MOOD_DATA[mood as keyof typeof MOOD_DATA] : (errorMsg ? MOOD_DATA.error : null);
  const moodColor = currentData?.color || "border-slate-300 bg-gray-50";
  const displayMessage = mood || errorMsg || "";
  const displayDescription = currentData?.desc || errorMsg || "";

  // I've cleaned up the icon component for better reusability and clarity.
  const CameraIcon = ({ className = "w-6 h-6 text-white" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
    </svg>
  );

  // I've simplified the ReadyState and ResultDisplay components to be more
  // direct with their styling and layout.
  const ReadyState = ({ isMobile = false }) => (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className={`bg-white/95 backdrop-blur-md rounded-2xl text-center shadow-xl ${isMobile ? 'p-4 max-w-[220px]' : 'p-6 max-w-sm'}`}>
        <div className={`bg-gradient-to-r from-blue-500 to-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4 text-white ${isMobile ? 'w-12 h-12' : 'w-16 h-16 rounded-2xl'}`}>
          <svg className={`w-7 h-7 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className={`font-bold text-slate-800 mb-1 ${isMobile ? 'text-base' : 'text-xl'}`}>Ready to Scan</h3>
        <p className={`text-slate-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          Position your face clearly in the frame to begin.
        </p>
      </div>
    </div>
  );

  const ResultDisplay = ({ isMobile = false }) => (
    <div className={`absolute inset-0 flex items-center justify-center p-4 ${isMobile ? 'p-3' : 'p-6'}`}>
      <div className={`bg-white/95 backdrop-blur-md rounded-2xl text-center w-full shadow-xl ${isMobile ? 'p-4 max-w-xs' : 'p-6 max-w-sm'}`}>
        <div className={`mx-auto mb-4 bg-gradient-to-r from-gray-200 to-white rounded-2xl flex items-center justify-center ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}`}>
          <div className={`font-extrabold ${isMobile ? 'text-3xl' : 'text-4xl'}`}>{currentData?.emoji}</div>
        </div>
        <h3 className={`font-bold text-slate-800 capitalize mb-1 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{displayMessage}</h3>
        <p className={`text-slate-600 mb-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>{displayDescription}</p>

        <div className={`bg-slate-100 rounded-lg ${isMobile ? 'p-2 mb-3 text-xs' : 'p-3 mb-4 text-sm'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-slate-600">Time</span>
            <span className="font-bold text-slate-800">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-600">Status</span>
            <div className="flex items-center gap-1">
              {detectionStatus === 'complete' ? (
                <>
                  <div className="bg-green-500 rounded-full w-2 h-2 animate-pulse"></div>
                  <span className="font-bold text-green-600">Complete</span>
                </>
              ) : (
                <>
                  <div className="bg-red-500 rounded-full w-2 h-2"></div>
                  <span className="font-bold text-red-600">Incomplete</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleCloseResult} className={`flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors ${isMobile ? 'py-2 px-3 text-sm' : 'py-3 px-4'}`}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // I've completely redesigned the full-screen (mobile) layout to be
  // more streamlined and visually appealing.
  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-4 flex items-center gap-3 safe-area-top shadow-sm">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-lg flex items-center justify-center text-white">
            <CameraIcon className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold">Mood Detection</h1>
        </div>

        <div className="flex-1 p-4 flex flex-col justify-center items-center">
          <div className={`relative w-full aspect-[3/4] max-w-sm rounded-3xl overflow-hidden border-4 ${moodColor} transition-all duration-500 bg-black shadow-lg`}>
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden w-full h-full object-cover absolute inset-0" />

            {isDetecting && (
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 text-white flex items-center gap-3">
                  <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                  <p className="font-medium text-sm">Analyzing...</p>
                </div>
              </div>
            )}
            {!mood && !isDetecting && !errorMsg && <ReadyState isMobile />}
            {(mood || errorMsg) && <ResultDisplay isMobile />}
          </div>
        </div>

        <div className="p-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 safe-area-bottom shadow-lg">
          {!mood && !isDetecting && !errorMsg && (
            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg">Start Mood Scan</span>
              </div>
            </button>
          )}

          {isDetecting && (
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-md">
                <div className="animate-spin w-5 h-5 border-2 border-blue-200 border-t-blue-500 rounded-full"></div>
                <span className="text-slate-700 font-medium">Analyzing...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // I've also redesigned the desktop layout to be more
  // modern and professional, keeping the new color scheme.
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-lg flex items-center justify-center text-white">
            <CameraIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Facial Mood Detection</h1>
            <p className="text-slate-600 text-sm hidden sm:block">AI-powered emotional analysis</p>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl w-full">
          <div className="lg:col-span-2">
            <div className={`relative w-full aspect-video rounded-3xl overflow-hidden border-4 ${moodColor} transition-all duration-500 bg-black shadow-xl`}>
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden w-full h-full object-cover absolute inset-0" />

              {isDetecting && (
                <div className="absolute top-6 left-6 right-6 z-10">
                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 text-white shadow-lg flex items-center gap-4">
                    <div className="animate-spin w-6 h-6 border-2 border-white/50 border-t-white rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-base">Analyzing your mood...</p>
                      <p className="text-sm opacity-80">Please stay still for a moment</p>
                    </div>
                  </div>
                </div>
              )}
              {!mood && !isDetecting && !errorMsg && <ReadyState />}
              {(mood || errorMsg) && <ResultDisplay />}
            </div>

            <div className="mt-6">
              {!mood && !isDetecting && !errorMsg && (
                <button
                  onClick={handleStart}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-3">
                    Start Mood Detection
                  </div>
                </button>
              )}

              {!isDetecting && (mood || errorMsg) && (
                <button
                  onClick={handleRetake}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Instructions
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {['Position your face clearly in the camera view', 'Ensure good lighting for accurate detection', 'Stay still during the 2-second analysis'].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}</div>
                    <p className="leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {['Natural expressions work best', 'Avoid extreme angles', 'Remove glasses if possible', 'Stay relaxed during detection'].map((tip, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <p className="leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}