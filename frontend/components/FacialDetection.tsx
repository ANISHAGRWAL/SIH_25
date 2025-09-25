"use client";

import { getCameraInput } from "@/utils/getCameraInput";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { facialDetection } from "@/actions/student";
import { useRouter } from "next/navigation";

// The MOOD_DATA object is unchanged as it provides the core logic and content.
const MOOD_DATA = {
  neutral: {
    level: "Neutral",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    message: "You're looking great! Positive vibes detected.",
    emoji: "😐",
  },
  happy: {
    level: "Happy",
    color: "text-green-600",
    bgColor: "bg-green-50",
    message: "Great job! Keep up your mental wellness strategies!",
    emoji: "😊",
  },
  sad: {
    level: "Sad",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    message: "It's okay to feel down sometimes. Try these to uplift yourself.",
    emoji: "😢",
  },
  angry: {
    level: "Angry",
    color: "text-red-700",
    bgColor: "bg-red-50",
    message: "Take a moment to breathe. These might help you cool down.",
    emoji: "😠",
  },
  fearful: {
    level: "Fearful",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    message: "You look worried. Everything will be alright.",
    emoji: "😱",
  },
  disgusted: {
    level: "Disgusted",
    color: "text-lime-600",
    bgColor: "bg-lime-50",
    message: "It might help to express or share with someone. Try these:",
    emoji: "🤢",
  },
  surprised: {
    level: "Surprised",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    message: "Use this spark of emotion to explore or reflect.",
    emoji: "😮",
  },
  default: {
    level: "Unclear",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    message: "We couldn't determine your mood. Here's something you can still try:",
    emoji: "❓",
  },
};

// This function now provides the redirection URLs based on the mood.
const getRedirectionUrls = (mood: string) => {
  switch (mood) {
    case "neutral":
      return [
        {
          title: "You seem Neutral",
          message: "You're doing well! Take a moment to reflect or enjoy something fun.",
          buttons: [
            { name: "Self-Assessment Tools", url: "/psych-tests" },
            { name: "Surya Namaskar (Yoga)", url: "/wellness/surya-namaskar" },
            { name: "Simple Habits to Boost Your Mental Wellness Daily (Blog)", url: "/blogs/simple-habit-to-boost-your-mind" },
            { name: "Gamified Wellbeing & Games", url: "/games" },
          ],
        },
      ];
    case "happy":
      return [
        {
          title: "You seem Happy",
          message: "Keep up the good mood! Here's something to keep you inspired.",
          buttons: [
            { name: "Gamified Wellbeing & Games", url: "/games" },
            { name: "Hidden Link Between Creativity and Mental Health (Blog)", url: "/blogs/creativity-mental-health-link" },
            { name: "Surya Namaskar (Yoga)", url: "/wellness/surya-namaskar" },
          ],
        },
      ];
    case "sad":
      return [
        {
          title: "You seem Sad",
          message: "It's okay to feel down sometimes. Try these to uplift yourself.",
          buttons: [
            { name: "Confidential Journaling", url: "/mind-log" },
            { name: "Motivational Chatbot", url: "/chatbot" },
            { name: "4-7-8 Breathing", url: "/wellness/4-7-8-breathing" },
            { name: "When Mental Health Makes Connections Harder (Blog)", url: "/blogs/mental-health-and-connection" },
          ],
        },
      ];
    case "angry":
      return [
        {
          title: "You seem Angry",
          message: "Take a moment to breathe. These might help you cool down.",
          buttons: [
            { name: "5-4-3-2-1 Grounding", url: "/wellness/5-4-3-2-1-grounding" },
            { name: "Motivational Chatbot", url: "/chatbot" },
            { name: "Digital Detox: How to Reset Your Mind (Blog)", url: "/blogs/digital-detox" },
          ],
        },
      ];
    case "fearful":
      return [
        {
          title: "You seem Fearful",
          message: "You're not alone. Consider reaching out or talking to someone.",
          buttons: [
            { name: "Motivational Chatbot", url: "/chatbot" },
            { name: "One-Tap Counselor Booking", url: "/book-session" },
            { name: "AI Calling Bot (Voice Support)", url: "/ai-calling" },
            { name: "Legs-Up-the-Wall Pose (Yoga)", url: "/wellness/yoga/" },
          ],
        },
      ];
    case "disgusted":
      return [
        {
          title: "You seem Disgusted",
          message: "It might help to express or share with someone. Try these:",
          buttons: [
            { name: "Confidential Journaling", url: "/mind-log" },
            { name: "Expert Support", url: "/exper-support" },
            { name: "Journaling for Clarity (Blog)", url: "/blogs/journaling-for-clarity" },
            { name: "Mindful Body Scan", url: "/wellness/mindful-body-scan" },
          ],
        },
      ];
    case "surprised":
      return [
        {
          title: "You seem Surprised",
          message: "Use this spark of emotion to explore or reflect.",
          buttons: [
            { name: "Self-Assessment Tools", url: "/psych-tests" },
            { name: "Gamified Wellbeing & Games", url: "/games" },
            { name: "Silence and Solitude: Why Doing Nothing is Sometimes Everything (Blog)", url: "/blogs/silence-and-solitude" },
            { name: "Mindful Body Scan", url: "/wellness/mindful-body-scan" },
          ],
        },
      ];
    default:
      return [
        {
          title: "Mood Detection Unclear",
          message: "We couldn't determine your mood. Here's something you can still try:",
          buttons: [
            { name: "Motivational Chatbot", url: "/chatbot" },
            { name: "AI Calling Bot (Voice Support)", url: "/ai-calling" },
            { name: "Child's Pose (Yoga)", url: "/wellness/yoga/1" },
            { name: "Why Talking About Mental Health Matters? (Blog)", url: "/blogs/why-Talking-About-Mental-Health-Matters" },
          ],
        },
      ];
  }
};

export default function ExpertSupportPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const handleStart = async () => {
    setMood(null);
    setErrorMsg(null);
    setIsDetecting(true);
    setShowResults(false);

    const input = await getCameraInput();
    if (!input) {
      setErrorMsg("Unable to access camera.");
      setIsDetecting(false);
      setShowResults(true);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      setErrorMsg("Canvas not available.");
      setIsDetecting(false);
      setShowResults(true);
      return;
    }

    const processDetection = async (imageSource: HTMLVideoElement | HTMLImageElement) => {
      const detection = await faceapi.detectSingleFace(imageSource, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

      if (!detection) {
        setErrorMsg("No face detected. Please try again.");
      } else {
        const topMood = Object.entries(detection.expressions!).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as keyof faceapi.FaceExpressions;
        const rawScore = detection.expressions[topMood];
        const score = typeof rawScore === "function" ? rawScore()[0].probability : rawScore;
        setMood(topMood);
        setMoodScore(score);

        if (token) {
          await facialDetection(token, { mood: topMood, moodScore: score });
        }
      }
      setIsDetecting(false);
      setShowResults(true);
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

  const currentData = mood ? MOOD_DATA[mood as keyof typeof MOOD_DATA] : MOOD_DATA.default;
  const redirectionUrls = getRedirectionUrls(mood || "default");

  // Enhanced mobile-responsive results UI
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          {/* Mobile-optimized header */}
          <div className="text-center space-y-3 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-800">
                Mood Detection Complete
              </h2>
              <p className="text-sm sm:text-base text-slate-600">Your Facial Expression Results</p>
            </div>

            {/* Enhanced mobile results card */}
            <div className="rounded-xl sm:rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-4 sm:p-8">
              <div className="space-y-4 sm:space-y-6">
                {/* Mobile-optimized score/emoji display */}
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center text-white mb-3 sm:mb-4 shadow-lg">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{currentData.emoji}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    Mood Detected
                  </div>
                </div>

                {/* Mobile-optimized result level */}
                <div className={`rounded-xl sm:rounded-2xl ${currentData.bgColor} p-4 sm:p-6 text-center`}>
                  <div className={`text-xl sm:text-2xl font-bold ${currentData.color} mb-2`}>
                    {currentData.level}
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {currentData.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile-optimized redirection buttons */}
            {redirectionUrls &&
              redirectionUrls.map((item, index) => (
                <div key={index} className="space-y-3 sm:space-y-4">
                  <div className="text-base sm:text-lg font-semibold text-slate-800">{item.title}</div>
                  <p className="text-sm sm:text-base text-slate-600 px-2">{item.message}</p>
                  
                  {/* Enhanced mobile button grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-3 sm:gap-4">
                    {item.buttons.map((button, btnIndex) => (
                      <button
                        key={btnIndex}
                        onClick={() => router.replace(button.url)}
                        className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm sm:text-base text-center active:scale-95"
                      >
                        {button.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            {/* Mobile-optimized action buttons */}
            <div className="flex justify-center pt-2 sm:pt-4">
              <button
                onClick={() => {
                  setShowResults(false);
                  setMood(null);
                  setErrorMsg(null);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium active:scale-95"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced mobile-responsive initial UI
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      {/* Mobile-optimized navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
              Facial Mood Detection
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm hidden sm:block">
              AI-powered emotional analysis
            </p>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-3 sm:p-6">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl w-full">
          {/* Mobile-first video section */}
          <div className="lg:col-span-2 order-1">
            <div className={`relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 ${isDetecting ? 'border-blue-400' : 'border-slate-300'} transition-all duration-500 shadow-lg sm:shadow-xl`}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="hidden w-full h-full object-cover absolute inset-0"
              />

              {/* Mobile-optimized detecting overlay */}
              {isDetecting && (
                <div className="absolute top-3 left-3 right-3 sm:top-6 sm:left-6 sm:right-6 z-10">
                  <div className="backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white shadow-lg flex items-center gap-3 sm:gap-4">
                    <div className="animate-spin w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/50 border-t-white rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base">
                        Analyzing your mood...
                      </p>
                      <p className="text-xs sm:text-sm opacity-80">
                        Please stay still for a moment
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile-optimized ready state */}
              {!isDetecting && (
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl text-center p-4 sm:p-6 max-w-xs sm:max-w-sm shadow-lg sm:shadow-xl">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-400 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white w-12 h-12 sm:w-16 sm:h-16">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1 text-lg sm:text-xl">Ready to Scan</h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Position your face clearly in the frame to begin.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile-optimized start button */}
            <div className="mt-4 sm:mt-6 space-y-4">
              <button
                onClick={handleStart}
                disabled={isDetecting}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 active:scale-95"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {isDetecting ? (
                    <div className="animate-spin w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/50 border-t-white rounded-full"></div>
                  ) : (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="text-sm sm:text-base">{isDetecting ? "Scanning..." : "Start Mood Detection"}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile-optimized sidebar - stacks below on mobile */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-2">
            {/* Instructions card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-lg">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Instructions
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-600">
                {[
                  "Position your face clearly in the camera view",
                  "Ensure good lighting for accurate detection",
                  "Stay still during the 2-second analysis",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro tips card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-lg">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Pro Tips
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600">
                {[
                  "Natural expressions work best",
                  "Avoid extreme angles",
                  "Remove glasses if possible",
                  "Stay relaxed during detection",
                ].map((tip, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
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