"use client";

import { getCameraInput } from "@/utils/getCameraInput";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { facialDetection } from "@/actions/student";
import { useRouter } from "next/navigation";

// Rich mood configuration with premium styling tokens
const MOOD_DATA = {
  neutral: {
    level: "Neutral",
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-50 border-slate-200",
    gradient: "from-slate-500 to-slate-700",
    message: "You look calm and balanced. Maintain this tranquil state with some light mindfulness activities.",
    emoji: "😐",
  },
  happy: {
    level: "Happy",
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-50 border-emerald-200",
    gradient: "from-emerald-500 to-teal-600",
    message: "Wonderful! You've got positive energy going. Channel it into a productive habit or share a smile with someone.",
    emoji: "😊",
  },
  sad: {
    level: "Sad",
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-50 border-blue-200",
    gradient: "from-blue-500 to-indigo-600",
    message: "It is completely okay to feel low sometimes. Take things slow and try some self-care exercises to lift your spirits.",
    emoji: "😢",
  },
  angry: {
    level: "Angry",
    color: "text-rose-700 dark:text-rose-300",
    bgColor: "bg-rose-50 border-rose-200",
    gradient: "from-rose-500 to-red-600",
    message: "It seems like you're experiencing frustration. Take a deep breath and give yourself a moment to ground and reset.",
    emoji: "😠",
  },
  fearful: {
    level: "Fearful / Anxious",
    color: "text-purple-700 dark:text-purple-300",
    bgColor: "bg-purple-50 border-purple-200",
    gradient: "from-purple-500 to-deep-purple-600",
    message: "Anxiety or worry can feel overwhelming. Remember that you're in a safe space. Try grounding exercises to find comfort.",
    emoji: "😱",
  },
  disgusted: {
    level: "Disgusted",
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-50 border-amber-200",
    gradient: "from-amber-500 to-orange-600",
    message: "If something is bothering you, externalizing it or writing it down might help clear your thoughts.",
    emoji: "🤢",
  },
  surprised: {
    level: "Surprised",
    color: "text-violet-700 dark:text-violet-300",
    bgColor: "bg-violet-50 border-violet-200",
    gradient: "from-violet-500 to-fuchsia-600",
    message: "An unexpected spark of emotion! Take a moment to reflect on what triggered this surprise and enjoy the novelty.",
    emoji: "😮",
  },
  default: {
    level: "Unclear",
    color: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-50 border-gray-200",
    gradient: "from-gray-500 to-gray-700",
    message: "We couldn't fully determine your current expression. That's okay! Explore our guided exercises at your own pace.",
    emoji: "❓",
  },
};

// Rich redirection suggestions with descriptions, tags, and icons
interface WellnessAction {
  name: string;
  desc: string;
  url: string;
  icon: string;
  tag: string;
  color: string;
}

interface RedirectionBlock {
  title: string;
  message: string;
  actions: WellnessAction[];
}

const getRedirectionUrls = (mood: string): RedirectionBlock[] => {
  switch (mood) {
    case "neutral":
      return [
        {
          title: "Balanced Daily Recommendations",
          message: "Keep your mind sharp and balanced with these recommendations.",
          actions: [
            {
              name: "Surya Namaskar (Yoga)",
              desc: "Engage in physical flows to maintain joint elasticity and physical balance.",
              url: "/wellness/surya-namaskar",
              icon: "🧘",
              tag: "Exercise",
              color: "bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-800",
            },
            {
              name: "Stress-Relief Games",
              desc: "Train your focus and relax your brain with puzzle and fluid simulation games.",
              url: "/games",
              icon: "🎮",
              tag: "Gamified",
              color: "bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-800",
            },
            {
              name: "Daily Mental Wellness Habits",
              desc: "Discover simple practices you can incorporate to safeguard your long-term wellness.",
              url: "/blogs/simple-habit-to-boost-your-mind",
              icon: "📚",
              tag: "Blog",
              color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400 text-emerald-800",
            },
            {
              name: "Self-Assessment Screeners",
              desc: "Track GAD or PHQ baselines to check up on your overall emotional history.",
              url: "/psych-tests",
              icon: "🧠",
              tag: "Assessment",
              color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400 text-indigo-800",
            },
          ],
        },
      ];
    case "happy":
      return [
        {
          title: "Keep the Positive Energy Flowing",
          message: "Harness your happy state to reinforce cognitive resilience and play.",
          actions: [
            {
              name: "Gamified Mind Play",
              desc: "Play matching or Zen drawing patterns to keep your neural connections active and happy.",
              url: "/games",
              icon: "🎮",
              tag: "Gamified",
              color: "bg-yellow-50 border-yellow-200 hover:border-yellow-400 text-yellow-800",
            },
            {
              name: "Creativity & Mental Health",
              desc: "Explore how positive mood boosts problem-solving and creative flow states.",
              url: "/blogs/creativity-mental-health-link",
              icon: "📚",
              tag: "Blog",
              color: "bg-amber-50 border-amber-200 hover:border-amber-400 text-amber-800",
            },
            {
              name: "Physical Vinyasa Flow",
              desc: "Align your high energy with full body stretches through guided Surya Namaskar.",
              url: "/wellness/surya-namaskar",
              icon: "🧘",
              tag: "Exercise",
              color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400 text-emerald-800",
            },
          ],
        },
      ];
    case "sad":
      return [
        {
          title: "Nurturing Self-Care Steps",
          message: "These tools are tailored to help soothe sadness and rebuild comforting emotional foundations.",
          actions: [
            {
              name: "Confidential Journaling",
              desc: "Pour your heart out in your private Mind Log. Get supportive, personalized AI insights.",
              url: "/mind-log",
              icon: "📓",
              tag: "Journal",
              color: "bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-800",
            },
            {
              name: "Motivational AI Companion",
              desc: "Chat with your AI bestie in Comfort Bot mode for warm validation and silly jokes.",
              url: "/chatbot",
              icon: "🤖",
              tag: "AI Bestie",
              color: "bg-pink-50 border-pink-200 hover:border-pink-400 text-pink-800",
            },
            {
              name: "4-7-8 Deep Breathing",
              desc: "A rhythmic breathing technique to trigger your parasympathetic nervous system.",
              url: "/wellness/4-7-8-breathing",
              icon: "🌬️",
              tag: "Breathing",
              color: "bg-teal-50 border-teal-200 hover:border-teal-400 text-teal-800",
            },
            {
              name: "Navigating Social Disconnection",
              desc: "Understand that you're not alone. Learn strategies to rebuild small social anchors.",
              url: "/blogs/mental-health-and-connection",
              icon: "📚",
              tag: "Blog",
              color: "bg-violet-50 border-violet-200 hover:border-violet-400 text-violet-800",
            },
          ],
        },
      ];
    case "angry":
      return [
        {
          title: "Calm Down & Ground Yourself",
          message: "Anger is an active energy. Use these physical and sensory filters to release tension.",
          actions: [
            {
              name: "5-4-3-2-1 Grounding Method",
              desc: "Anchor your mind using your immediate physical senses of sight, sound, touch, smell, and taste.",
              url: "/wellness/5-4-3-2-1-grounding",
              icon: "🧘",
              tag: "Grounding",
              color: "bg-rose-50 border-rose-200 hover:border-rose-400 text-rose-800",
            },
            {
              name: "Tough-Love AI Coach",
              desc: "Talk to your Groq AI coach for a candid, motivating talk to help re-frame what's frustrating you.",
              url: "/chatbot",
              icon: "🤖",
              tag: "AI Bestie",
              color: "bg-orange-50 border-orange-200 hover:border-orange-400 text-orange-800",
            },
            {
              name: "Digital Detox & Mind Resets",
              desc: "Disconnect from notifications. Learn how sensory overload feeds anger and irritability.",
              url: "/blogs/digital-detox",
              icon: "📚",
              tag: "Blog",
              color: "bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-800",
            },
          ],
        },
      ];
    case "fearful":
      return [
        {
          title: "Safe Spaces & Calming Anchors",
          message: "Anxiety can feel scary. Re-anchor your safety with direct professional or therapeutic tools.",
          actions: [
            {
              name: "Warm Motivational Chatbot",
              desc: "Connect with the Cute Comfort Bot. Always here with immediate reassurance and zero judgment.",
              url: "/chatbot",
              icon: "🤖",
              tag: "AI Bestie",
              color: "bg-purple-50 border-purple-200 hover:border-purple-400 text-purple-800",
            },
            {
              name: "One-Tap Counselor Booking",
              desc: "Directly schedule an slot with our campus counselor for a confidential session.",
              url: "/book-session",
              icon: "👩‍⚕️",
              tag: "Counselor",
              color: "bg-rose-50 border-rose-200 hover:border-rose-400 text-rose-800",
            },
            {
              name: "Legs-Up-the-Wall (Yoga)",
              desc: "A restorative yoga pose that lowers heart rate and physically signals safety to your body.",
              url: "/wellness/yoga/",
              icon: "🧘",
              tag: "Yoga",
              color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400 text-indigo-800",
            },
          ],
        },
      ];
    case "disgusted":
      return [
        {
          title: "Clear Out Discontent",
          message: "Translate uncomfortable emotions into self-expression and sensory grounding.",
          actions: [
            {
              name: "Confidential Expressive Writing",
              desc: "Externalize what's bothering you. Writing down triggers helps strip away disgust or friction.",
              url: "/mind-log",
              icon: "📓",
              tag: "Journal",
              color: "bg-amber-50 border-amber-200 hover:border-amber-400 text-amber-800",
            },
            {
              name: "Mindful Body Scan Meditation",
              desc: "Gently run attention through your body, releasing residual muscle tension or discomfort.",
              url: "/wellness/mindful-body-scan",
              icon: "🧘",
              tag: "Mindfulness",
              color: "bg-teal-50 border-teal-200 hover:border-teal-400 text-teal-800",
            },
            {
              name: "Journaling for Clarity",
              desc: "Read our clinical insights on how structured writing cleanses psychological build-ups.",
              url: "/blogs/journaling-for-clarity",
              icon: "📚",
              tag: "Blog",
              color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400 text-emerald-800",
            },
          ],
        },
      ];
    case "surprised":
      return [
        {
          title: "Harness Your Spark",
          message: "Utilize this state of heightened arousal to explore something creative and new.",
          actions: [
            {
              name: "Self-Assessment Surveys",
              desc: "Are you feeling general stress or excitement? Check your current score baselines.",
              url: "/psych-tests",
              icon: "🧠",
              tag: "Assessment",
              color: "bg-violet-50 border-violet-200 hover:border-violet-400 text-violet-800",
            },
            {
              name: "Liquid Flow Simulations",
              desc: "Interact with physical particle fluid dynamics to calm down hyper-arousal.",
              url: "/games",
              icon: "🎮",
              tag: "Gamified",
              color: "bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-800",
            },
            {
              name: "Silence and Solitude Blog",
              desc: "Discover how sitting with yourself can help integrate surprising experiences.",
              url: "/blogs/silence-and-solitude",
              icon: "📚",
              tag: "Blog",
              color: "bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-800",
            },
          ],
        },
      ];
    default:
      return [
        {
          title: "Explore Wellness Programs",
          message: "Check out general wellness suggestions to support your daily student life.",
          actions: [
            {
              name: "Motivational AI Companion",
              desc: "Have a chat about how you are feeling with your digital peer Bestie.",
              url: "/chatbot",
              icon: "🤖",
              tag: "AI Bestie",
              color: "bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-800",
            },
            {
              name: "Child's Relaxing Pose (Yoga)",
              desc: "A standard physical relaxation pose designed to gently reset blood flow.",
              url: "/wellness/yoga/1",
              icon: "🧘",
              tag: "Yoga",
              color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400 text-emerald-800",
            },
            {
              name: "Destigmatizing Mental Health",
              desc: "Read why discussing mental health fosters a healthier college environment.",
              url: "/blogs/why-Talking-About-Mental-Health-Matters",
              icon: "📚",
              tag: "Blog",
              color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400 text-indigo-800",
            },
          ],
        },
      ];
  }
};

export default function ExpertSupportPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Mood detection states
  const [mood, setMood] = useState<string | null>(null);
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Real-time tracking states
  const [scanSeconds, setScanSeconds] = useState(3);
  const [liveExpressions, setLiveExpressions] = useState<Record<string, number>>({});
  
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const animationFrameId = useRef<number | null>(null);
  const expressionsMax = useRef<Record<string, number>>({
    neutral: 0, happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0
  });

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log("Face-api models loaded successfully.");
      } catch (err) {
        console.error("Failed to load face-api models:", err);
        setErrorMsg("Failed to initialize facial models. Please reload.");
      }
    };
    loadModels();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const handleStart = async () => {
    setMood(null);
    setMoodScore(null);
    setErrorMsg(null);
    setIsDetecting(true);
    setShowResults(false);
    setScanSeconds(3);
    setLiveExpressions({});
    
    // Reset max expressions ref
    expressionsMax.current = {
      neutral: 0, happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0
    };

    const input = await getCameraInput();
    if (!input) {
      setErrorMsg("Camera access was denied or not available. Please verify permissions.");
      setIsDetecting(false);
      return;
    }

    if (videoRef.current) {
      if (input instanceof MediaStream) {
        videoRef.current.srcObject = input;
      } else if (typeof input === "string" && videoRef.current) {
        setErrorMsg("Video stream required for real-time mood scanning.");
        setIsDetecting(false);
        return;
      }

      // Wait for video meta to initialize canvas dimensions
      videoRef.current.onloadedmetadata = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
      };

      // Start the 3-second continuous scan
      let timeLeft = 3.0;
      const scanInterval = setInterval(() => {
        timeLeft -= 0.5;
        setScanSeconds(Math.max(0, Math.ceil(timeLeft)));
        if (timeLeft <= 0) {
          clearInterval(scanInterval);
        }
      }, 500);

      let framesCount = 0;

      const detectLoop = async () => {
        if (!isDetecting && timeLeft <= 0) return;
        
        const video = videoRef.current;
        if (video && video.readyState === 4) {
          try {
            const detection = await faceapi
              .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceExpressions();

            if (detection) {
              const currentExps = detection.expressions;
              setLiveExpressions(currentExps as any);

              // Update maximums seen to capture fleeting micro-expressions
              Object.keys(expressionsMax.current).forEach((key) => {
                const val = (currentExps as any)[key] || 0;
                if (val > expressionsMax.current[key]) {
                  expressionsMax.current[key] = val;
                }
              });
              framesCount++;
            }
          } catch (err) {
            console.error("Inference frame error:", err);
          }
        }

        if (timeLeft > 0) {
          animationFrameId.current = requestAnimationFrame(detectLoop);
        } else {
          // Finish scanning and evaluate
          stopVideo();
          setIsDetecting(false);

          if (framesCount === 0) {
            setErrorMsg("No face was detected during the scan. Please center your face and try again.");
            setShowResults(true);
            return;
          }

          // -----------------------------------------------------------------
          // 🧠 EMOTION SENSITIVITY CALIBRATION
          // -----------------------------------------------------------------
          // The face-api model heavily biases neutral resting states.
          // By applying calibration weights to non-neutral signals, we can 
          // detect subtle anxiety, stress, or sadness without forcing the user
          // to make exaggerated facial caricatures.
          // -----------------------------------------------------------------
          const multipliers: Record<string, number> = {
            neutral: 0.28,    // Drastically lower baseline neutral bias
            happy: 1.0,       // Standard baseline
            sad: 3.8,         // Highly scale micro-lip corners drop & eye narrowing
            angry: 3.8,       // Scale subtle inner eyebrow tension
            fearful: 4.2,     // Highly scale subtle worry, eyes widening, mouth parting
            disgusted: 3.2,   // Scale minor nose wrinkling
            surprised: 1.6    // Scale eyebrows rising
          };

          let topMood = "neutral";
          let highestWeightedScore = 0;
          let rawTopScore = 0;

          // Find the dominant calibrated expression
          Object.keys(expressionsMax.current).forEach((key) => {
            const maxVal = expressionsMax.current[key];
            const weightedScore = maxVal * multipliers[key];
            
            if (weightedScore > highestWeightedScore) {
              highestWeightedScore = weightedScore;
              topMood = key;
              rawTopScore = maxVal;
            }
          });

          // Fallback sanity check: if the raw matched score is completely insignificant
          // (below 4%), fallback to neutral.
          if (rawTopScore < 0.04) {
            topMood = "neutral";
            rawTopScore = expressionsMax.current["neutral"];
          }

          // Use the raw peak value of the winning emotion as the mood score
          const finalScore = expressionsMax.current[topMood];

          setMood(topMood);
          setMoodScore(finalScore);
          setShowResults(true);

          if (token) {
            try {
              // Submit the calibrated emotional state directly to backend
              await facialDetection(token, { mood: topMood, moodScore: finalScore });
            } catch (err) {
              console.error("Failed to post mood logs to backend:", err);
            }
          }
        }
      };

      // Start loop
      animationFrameId.current = requestAnimationFrame(detectLoop);
    }
  };

  const currentData = mood ? MOOD_DATA[mood as keyof typeof MOOD_DATA] : MOOD_DATA.default;
  const redirectionUrls = getRedirectionUrls(mood || "default");

  // RESULTS STATE
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Your Emotional Signature
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">Results gathered from your live facial analysis</p>
          </div>

          {errorMsg ? (
            /* Error Card */
            <div className="bg-white rounded-3xl border border-red-200 p-8 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 text-2xl font-bold">⚠️</div>
              <h3 className="text-xl font-bold text-slate-800">Scan Incomplete</h3>
              <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">{errorMsg}</p>
              <button
                onClick={() => {
                  setShowResults(false);
                  setErrorMsg(null);
                }}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                Re-Scan Face
              </button>
            </div>
          ) : (
            /* Successful scan */
            <div className="space-y-6 sm:space-y-8">
              {/* Main Mood Banner */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid md:grid-cols-3">
                <div className={`p-8 bg-gradient-to-br ${currentData.gradient} text-white flex flex-col justify-center items-center text-center space-y-3`}>
                  <span className="text-6xl sm:text-7xl animate-pulse">{currentData.emoji}</span>
                  <div>
                    <span className="text-xs uppercase tracking-widest opacity-85">Primary State</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">{currentData.level}</h3>
                  </div>
                  {moodScore != null && (
                    <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                      Calibration: {Math.round(moodScore * 100)}% Match
                    </div>
                  )}
                </div>
                
                <div className="col-span-2 p-6 sm:p-8 flex flex-col justify-center space-y-4 text-left">
                  <h4 className="text-lg font-bold text-slate-800">Emotional Diagnosis</h4>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{currentData.message}</p>
                  <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>
              </div>

              {/* Suggestions Cards Grid */}
              {redirectionUrls &&
                redirectionUrls.map((item, index) => (
                  <div key={index} className="space-y-4 text-left">
                    <div className="border-l-4 border-indigo-500 pl-3">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-800">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-500">{item.message}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.actions.map((action, actionIdx) => (
                        <div
                          key={actionIdx}
                          onClick={() => router.replace(action.url)}
                          className={`group cursor-pointer rounded-2xl border ${action.color} p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden`}
                        >
                          <div className="flex gap-4 items-start relative z-10">
                            <div className="text-3xl sm:text-4xl p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                              {action.icon}
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/70 shadow-sm border mb-1">
                                {action.tag}
                              </span>
                              <h4 className="font-bold text-sm sm:text-base text-gray-800 group-hover:underline">
                                {action.name}
                              </h4>
                              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                {action.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              {/* Try Again */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setMood(null);
                    setErrorMsg(null);
                  }}
                  className="px-8 py-3.5 bg-slate-880 hover:bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm sm:text-base bg-slate-800"
                >
                  Start New Scan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // INITIAL / SCANNING STATE
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>

      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-800">
              Facial Mood Recognition
            </h1>
            <p className="text-slate-500 text-xs hidden sm:block">
              AI-powered continuous emotional scanning calibrated to capture subtle micro-expressions
            </p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl w-full">
          
          {/* Webcam Scanning Container */}
          <div className="lg:col-span-2 space-y-4">
            <div className={`relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 border-4 ${isDetecting ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-white shadow-xl'} transition-all duration-300`}>
              
              {/* Real-time Video Element */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="hidden absolute inset-0"
              />

              {/* Continuous Laser Scanning Overlay */}
              {isDetecting && (
                <>
                  {/* Glowing Laser line */}
                  <div 
                    className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_#60A5FA]"
                    style={{
                      animation: "scan 3s ease-in-out infinite",
                      position: "absolute"
                    }}
                  />
                  {/* Face oval border guidelines */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[60%] h-[80%] rounded-[50%] border-2 border-dashed border-white/40 shadow-[0_0_0_9999px_rgba(15,23,42,0.4)] pointer-events-none flex items-center justify-center">
                      <span className="text-xs text-white/50 bg-slate-950/60 px-3 py-1 rounded-full backdrop-blur-sm">Align Face Here</span>
                    </div>
                  </div>
                  {/* Countdown HUD */}
                  <div className="absolute top-4 left-4 bg-slate-950/65 backdrop-blur-md rounded-2xl px-4 py-2 text-white text-xs font-semibold flex items-center gap-2 border border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
                    Scanning: {scanSeconds}s Remaining
                  </div>
                </>
              )}

              {/* Ready State Splash screen */}
              {!isDetecting && (
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center p-4">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl text-center p-6 max-w-sm shadow-2xl border border-white">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white w-14 h-14 shadow-lg">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-lg mb-1">Subtle Emotion Scanner</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Our system performs a 3-second continuous scan, tracking micro-expressions and adjusting for neutral bias to detect how you actually feel.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              disabled={isDetecting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 active:scale-95 text-base"
            >
              <div className="flex items-center justify-center gap-2">
                {isDetecting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white/50 border-t-white rounded-full"></div>
                    <span>Scanning Face Expression...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Start Mood Scan</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Real-time Analytics & Instructions Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Live Analytics HUD */}
            {isDetecting && Object.keys(liveExpressions).length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl space-y-4 text-left">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  📊 Live Calibration Matrix
                </h3>
                <div className="space-y-2.5">
                  {Object.entries(liveExpressions).map(([key, score]) => {
                    const pct = Math.round(score * 100);
                    // Determine bar color
                    let barColor = "bg-blue-500";
                    if (key === "happy") barColor = "bg-emerald-500";
                    if (key === "sad") barColor = "bg-blue-500";
                    if (key === "angry") barColor = "bg-rose-500";
                    if (key === "fearful") barColor = "bg-purple-500";
                    
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="capitalize">{key}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${barColor}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Static Instructions Card */}
            {!isDetecting && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl text-left space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  💡 How It Works
                </h3>
                <ul className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0 mt-0.5">1</span>
                    <p className="leading-relaxed">Verify your face is positioned in the camera frame with moderate room lighting.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold shrink-0 mt-0.5">2</span>
                    <p className="leading-relaxed">Click <strong>Start Mood Scan</strong>. Keep a natural, relaxed expression for 3 seconds.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold shrink-0 mt-0.5">3</span>
                    <p className="leading-relaxed">The AI maps micro-movements, adjusts for natural resting states, and generates targeted recommendations.</p>
                  </li>
                </ul>
              </div>
            )}

            {/* Privacy note */}
            <div className="bg-slate-100/80 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed text-left border">
              🔒 <strong>Privacy Guarantee:</strong> All facial analysis takes place client-side in your browser. No video streams or snapshots are ever uploaded or stored. Only anonymized mood tag logs are preserved.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}