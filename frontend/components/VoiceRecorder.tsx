"use client"

import React, { useState, useRef, useEffect } from 'react';

// --- Type Definitions for better code safety ---
type Status = 'idle' | 'permission_denied' | 'recording' | 'analyzing' | 'success' | 'error';

interface Recommendation {
  title: string;
  message: string;
  buttons: { name: string; url: string }[];
}

const getVoiceRecommendation = (mood: string): Recommendation[] => {
  switch (mood.toLowerCase()) {
    case "angry":
      return [
        {
          title: "You seem Angry",
          message: "Try calming yourself and explore these features.",
          buttons: [
            { name: "Alternate Nostril Breathing", url: "/wellness#nadi-shodhana" },
            { name: "Motivational Chatbot + SOS Alerts", url: "/chatbot" },
            { name: "Multilingual Resource Hub", url: "/blogs" },
          ],
        },
      ];
    case "disgust":
      return [
        {
          title: "You seem Disgusted",
          message: "Expressing yourself may help. Try these:",
          buttons: [
            { name: "Daily Mind Log", url: "/mind-log" },
            { name: "Anonymous Volunteer Forum", url: "/exper-support" },
            { name: "Simple Habits to Boost Your Mental Wellness Daily", url: "/blogs#habit-blog" },
            { name: "Yoga", url: "/wellness/yoga" },
          ],
        },
      ];
    case "fear":
      return [
        {
          title: "You seem Fearful",
          message: "Reach out or calm yourself using these features:",
          buttons: [
            { name: "4-7-8 Breathing", url: "/wellness#478-breathing" },
            { name: "One-Tap Counselor Booking", url: "/book-session" },
            { name: "AI Calling Bot (Voice Support)", url: "/ai-calling" },
          ],
        },
      ];
    case "happy":
      return [
        {
          title: "You seem Happy",
          message: "Keep the good mood going!",
          buttons: [
            { name: "Gamified Wellbeing & Memory Games", url: "/games" },
            { name: "Surya Namaskar", url: "/wellness#surya-namaskar" },
            { name: "Hidden Link Between Creativity and Mental Health", url: "/blogs#creativity-blog" },
          ],
        },
      ];
    case "neutral":
      return [
        {
          title: "You seem Neutral",
          message: "Maintain balance with these features:",
          buttons: [
            { name: "Self-Assessment Tools", url: "/psych-tests" },
            { name: "Mindful Body Scan", url: "/wellness#body-scan" },
            { name: "Simple Habits to Boost Your Mental Wellness Daily", url: "/blogs#habit-blog" },
          ],
        },
      ];
    case "ps":
      return [
        {
          title: "You seem Surprised",
          message: "Explore these to reflect or relax:",
          buttons: [
            { name: "5-4-3-2-1 Grounding", url: "/wellness#grounding" },
            { name: "Motivational Chatbot + SOS Alerts", url: "/chatbot" },
            { name: "Multilingual Resource Hub", url: "/blogs" },
          ],
        },
      ];
    case "sad":
      return [
        {
          title: "You seem Sad",
          message: "It's okay to feel down. Try these features to uplift yourself:",
          buttons: [
            { name: "Child's Pose / Legs-Up-the-Wall Pose", url: "/wellness#child-legs-pose" },
            { name: "Daily Mind Log", url: "/mind-log" },
            { name: "Journaling for Clarity", url: "/blogs#journaling-blog" },
            { name: "Motivational Chatbot + SOS Alerts", url: "/chatbot" },
          ],
        },
      ];
    default:
      return [
        {
          title: "Mood Unclear",
          message: "We couldn't determine your mood. Try these:",
          buttons: [
            { name: "Motivational Chatbot + SOS Alerts", url: "/chatbot" },
            { name: "AI Calling Bot (Voice Support)", url: "/ai-calling" },
          ],
        },
      ];
  }
};

interface EmotionScore {
  label: string;
  score: number;
}

interface AnalysisResult {
  label: string;
  confidence: number;
  emotions: EmotionScore[];
  error?: string;
}

const VoiceEmotionAnalyzer = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState(0);
  const MAX_RECORDING_TIME = 10;

  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 💡 NEW: Warm-up request logic ---
  useEffect(() => {
    // This function sends a "ping" to the server when the page loads.
    const warmUpServer = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://sih-25-5.onrender.com";
        // We use the new /wake-up endpoint
        await fetch(`${API_URL}/wake-up`);
        console.log("Server has been warmed up.");
      } catch (err) {
        console.error("Failed to warm up server, it might be down or starting.", err);
      }
    };

    warmUpServer();
  }, []); // The empty array ensures this runs only once on component mount.

  const textLines = [
    "I wonder what the weather will be like tomorrow.",
    "It's been a while since I last went out for a walk.",
    "I think I might try cooking something new tonight.",
    "Sometimes I just sit and watch everything around me.",
    "I can't believe how quickly this week has gone by.",
  ];

  const getRandomText = () => {
    const randomIndex = Math.floor(Math.random() * textLines.length);
    setCurrentText(textLines[randomIndex]);
  };

  useEffect(() => {
    getRandomText();
  }, []);

  useEffect(() => {
    if (status === 'recording' && recordingTime >= MAX_RECORDING_TIME) {
      stopRecording();
    }
  }, [recordingTime, status]);

  const startRecording = async () => {
    try {
      setStatus('idle');
      setError(null);
      setResult(null);
      setAudioURL(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      audioChunks.current = [];
      setRecordingTime(0);

      recorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        sendToBackend(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setStatus('recording');

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Microphone access was denied. Please enable it in your browser settings to use this feature.");
      setStatus('permission_denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && status === 'recording') {
      mediaRecorder.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const sendToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    setStatus('analyzing');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://sih-25-5.onrender.com";
      const res = await fetch(`${API_URL}/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data: AnalysisResult = await res.json();
      setResult(data);
      setStatus('success');
      // Get recommendations based on detected mood
      const recommendations = getVoiceRecommendation(data.label);
      console.log("Recommended Features:", recommendations);
    } catch (err) {
      console.error("Error uploading audio:", err);
      setError("Failed to analyze audio. The server might be busy or down. Please try again later.");
      setStatus('error');
    }
  };

  const getMoodIcon = (mood: string) => {
    const icons: { [key: string]: string } = {
      'angry': '😠',
      'disgust': '🤢',
      'fear': '😨',
      'happy': '😊',
      'neutral': '😐',
      'ps': '😮',
      'sad': '😢'
    };
    return icons[mood?.toLowerCase()] || '🎭';
  };

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      'angry': 'bg-red-100 border-red-300 text-red-800',
      'disgust': 'bg-green-100 border-green-300 text-green-800',
      'fear': 'bg-purple-100 border-purple-300 text-purple-800',
      'happy': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'neutral': 'bg-gray-100 border-gray-300 text-gray-800',
      'ps': 'bg-blue-100 border-blue-300 text-blue-800',
      'sad': 'bg-indigo-100 border-indigo-300 text-indigo-800'
    };
    return colors[mood?.toLowerCase()] || 'bg-slate-100 border-slate-300 text-slate-800';
  };

  const startNewAnalysis = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setAudioURL(null);
    setRecordingTime(0);
    getRandomText();
  };

  const progressPercentage = (recordingTime / MAX_RECORDING_TIME) * 100;

  // Derived state for analyzing status
  const isAnalyzing = status === 'analyzing';
  // Derived state for recording status
  const recording = status === 'recording';

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Header Section - Mobile optimized */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-3 sm:mb-4">
            🎭 Voice Emotion Analysis
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the emotions in your voice through advanced AI analysis. Simply read the provided text and let our system analyze your vocal patterns.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Steps Section - Mobile responsive grid */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6 sm:mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3 sm:mb-4">1</div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Read the Text</h4>
              <p className="text-xs sm:text-sm text-gray-600">A random sentence will appear for you to read aloud</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3 sm:mb-4">2</div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Start Recording</h4>
              <p className="text-xs sm:text-sm text-gray-600">Click record and speak the text naturally</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3 sm:mb-4">3</div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">AI Analysis</h4>
              <p className="text-xs sm:text-sm text-gray-600">Our system analyzes your voice for emotional patterns</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3 sm:mb-4">4</div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Get Results</h4>
              <p className="text-xs sm:text-sm text-gray-600">View your emotion analysis and insights</p>
            </div>
          </div>
        </div>

        {/* Main Analysis Interface - Mobile optimized */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
          {!result && !isAnalyzing && (
            <div>
              {/* Text Display - Mobile responsive */}
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">📖 Please read this text aloud:</h3>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 text-center font-medium leading-relaxed px-2">
                  "{currentText}"
                </p>
              </div>

              {/* Recording Interface - Mobile optimized */}
              <div className="text-center">
                {!recording && (
                  <button
                    onClick={startRecording}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🎙️ Start Recording
                  </button>
                )}

                {recording && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-lg sm:text-xl font-semibold text-red-600">Recording in progress...</span>
                    </div>
                    
                    <div className="max-w-xs sm:max-w-md mx-auto px-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{recordingTime}s</span>
                        <span>{MAX_RECORDING_TIME}s</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-red-500 h-2 sm:h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={stopRecording}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      ⏹️ Stop & Submit
                    </button>
                  </div>
                )}

                <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 max-w-sm sm:max-w-md mx-auto px-2">
                  <p>💡 <strong>Tips:</strong> Speak naturally and clearly. Recording will automatically stop after {MAX_RECORDING_TIME} seconds, or you can stop early by clicking the stop button.</p>
                </div>
              </div>
            </div>
          )}

          {/* Audio Preview - Mobile responsive */}
          {audioURL && !isAnalyzing && !result && (
            <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-3 text-center text-sm sm:text-base">🎧 Your Recording Preview:</h4>
              <audio controls src={audioURL} className="w-full" />
            </div>
          )}

          {/* Loading State - Mobile optimized */}
          {isAnalyzing && (
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 sm:mb-6"></div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">🔍 Analyzing Your Voice...</h3>
              <p className="text-sm sm:text-base text-gray-600">Our AI is processing your vocal patterns to detect emotions</p>
              <div className="mt-4 max-w-xs sm:max-w-md mx-auto bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
          )}

          {/* Results Display - Mobile responsive */}
          {result && !isAnalyzing && (
            <div className="space-y-4 sm:space-y-6">
              {result.error ? (
                <div className="p-4 sm:p-6 bg-red-50 border border-red-200 rounded-xl text-center">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">❌</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-red-800 mb-2">Analysis Failed</h3>
                  <p className="text-sm sm:text-base text-red-700 mb-3 sm:mb-4 px-2">{result.error}</p>
                  <button 
                    onClick={startNewAnalysis}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div>
                  {/* Main Result - Mobile responsive */}
                  <div className={`p-4 sm:p-6 md:p-8 border-2 rounded-xl ${getMoodColor(result.label)}`}>
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">{getMoodIcon(result.label)}</div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Detected Emotion</h3>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold capitalize mb-3 sm:mb-4">{result.label || "Unknown"}</p>
                      
                      {result.confidence && (
                        <div className="max-w-xs sm:max-w-sm mx-auto">
                          <p className="text-xs sm:text-sm font-medium mb-2">Confidence Level</p>
                          <div className="w-full bg-white bg-opacity-50 rounded-full h-2 sm:h-3">
                            <div 
                              className="bg-current h-2 sm:h-3 rounded-full transition-all duration-1000"
                              style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
                            ></div>
                          </div>
                          <p className="text-base sm:text-lg font-semibold mt-2">{(result.confidence * 100).toFixed(1)}%</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommendations Section - Mobile responsive */}
                  <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-xl">
                    {getVoiceRecommendation(result.label).map((rec, idx) => (
                      <div key={idx} className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">{rec.title}</h4>
                        <p className="text-gray-700 mb-3 text-sm sm:text-base">{rec.message}</p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                          {rec.buttons.map((btn, bIdx) => (
                            <a
                              key={bIdx}
                              href={btn.url}
                              className="px-3 sm:px-4 py-2 bg-blue-500 text-white text-center text-sm sm:text-base rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              {btn.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Text that was read - Mobile responsive */}
                  <div className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">📖 Text You Read</h4>
                    <p className="text-gray-700 text-base sm:text-lg italic leading-relaxed">"{currentText}"</p>
                  </div>

                  {/* Additional Analysis Data - Mobile responsive */}
                  {result.emotions && Array.isArray(result.emotions) && (
                    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">🎭 Detailed Emotion Breakdown</h4>
                      <div className="space-y-2 sm:space-y-3">
                        {result.emotions.map((emotion: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700 font-medium text-sm sm:text-base">{emotion.label}</span>
                            <div className="flex items-center">
                              <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-2 mr-2 sm:mr-3">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(emotion.score * 100).toFixed(1)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs sm:text-sm text-gray-600 min-w-[2.5rem] sm:min-w-[3rem] font-medium">
                                {(emotion.score * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audio Playback - Mobile responsive */}
                  {audioURL && (
                    <div className="p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">🎧 Your Recording</h4>
                      <audio controls src={audioURL} className="w-full" />
                    </div>
                  )}

                  {/* Action Buttons - Mobile responsive */}
                  <div className="flex justify-center pt-4">
                    <button 
                      onClick={startNewAnalysis}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      🔄 Try Another Text
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceEmotionAnalyzer;