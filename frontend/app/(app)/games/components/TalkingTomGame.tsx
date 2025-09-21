import React, { useState, useEffect } from "react";

export default function WorkingTalkingTom() {
  const [listening, setListening] = useState(false);
  const [catMessage, setCatMessage] = useState("Hi! I'm Tom! Click me or talk to me! 🐱");
  const [catExpression, setCatExpression] = useState<keyof typeof expressions>("happy");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Check speech support on load
  useEffect(() => {
    const checkSpeechSupport = () => {
      const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      const hasSynthesis = 'speechSynthesis' in window;
      setSpeechSupported(hasRecognition && hasSynthesis);
      
      if (hasRecognition && hasSynthesis) {
        setCatMessage("Hi! I'm Tom! Click me or talk to me! 🐱");
      } else {
        setCatMessage("Hi! I'm Tom! Click me to play! (Speech not supported in this browser) 🐱");
      }
    };
    
    checkSpeechSupport();
  }, []);

  // Cat expressions
  const expressions = {
    happy: { face: "😸", color: "from-orange-400 to-orange-600" },
    excited: { face: "😻", color: "from-yellow-400 to-orange-500" },
    sleepy: { face: "😴", color: "from-blue-400 to-purple-500" },
    curious: { face: "🙀", color: "from-green-400 to-blue-500" },
    playful: { face: "😹", color: "from-pink-400 to-purple-500" },
    love: { face: "😽", color: "from-red-400 to-pink-500" }
  };

  // Smart responses
  const getResponse = (text: string) => {
    const lower = text.toLowerCase();
    
    if (lower.includes("hello") || lower.includes("hi")) {
      setCatExpression("excited");
      return "Hello! I'm so happy to see you! 😸";
    }
    if (lower.includes("how are you")) {
      setCatExpression("happy");
      return "I'm purr-fect! How are you doing? 😊";
    }
    if (lower.includes("sing")) {
      setCatExpression("playful");
      return "🎵 Meow meow meow, I'm a happy cat! 🎵";
    }
    if (lower.includes("dance")) {
      return startDance();
    }
    if (lower.includes("food") || lower.includes("hungry")) {
      setCatExpression("excited");
      return "Ooh! I love fish and milk! Do you have treats? 🐟";
    }
    if (lower.includes("cute") || lower.includes("adorable")) {
      setCatExpression("love");
      return "Aww thank you! You're pretty awesome too! 💕";
    }
    if (lower.includes("joke")) {
      setCatExpression("playful");
      return "Why don't cats play poker? Because they're afraid of cheetahs! Get it? 😹";
    }
    if (lower.includes("sleep") || lower.includes("tired")) {
      setCatExpression("sleepy");
      return "Yawn... I'm getting sleepy too... 💤";
    }
    
    setCatExpression("curious");
    const responses = [
      "That's interesting! Tell me more! 🤔",
      "Meow! You said: " + text + " 😸",
      "Hmm, let me think about that... 🧠",
      "You're so smart! I wish I could understand everything! 📚",
      "That sounds cool! What else can you tell me? ✨"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Speech synthesis (Tom talks)
  const speakText = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 1.5;
        utterance.volume = 0.8;
        
        // Start mouth animation
        setIsAnimating(true);
        
        utterance.onend = () => {
          setIsAnimating(false);
        };
        
        utterance.onerror = () => {
          setIsAnimating(false);
        };
        
        // Small delay for better compatibility
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, 100);
      }
    } catch (error) {
      console.log("Speech synthesis not available");
      setIsAnimating(false);
    }
  };

  // Speech recognition (listening to user)
  const startListening = () => {
    // First check if we're in HTTPS or localhost (required for microphone)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      setCatMessage("🔒 Microphone needs HTTPS! Try the secure version or localhost! But you can still click me! 😸");
      speakText("Microphone needs a secure connection, but you can still click me!");
      return;
    }

    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setCatMessage("❌ Speech recognition not supported! Try Chrome, Edge, or Safari! But you can click me! 😸");
      speakText("Speech recognition not supported, but you can still click me!");
      return;
    }

    try {
      // Create recognition instance
      const recognition = new SpeechRecognition();
      
      // Configure recognition settings
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      // Set UI to listening state
      setListening(true);
      setCatExpression("curious");
      setCatMessage("🎤 Listening... Speak now!");

      recognition.onresult = (event: any) => {
        setListening(false);
        
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0].transcript.trim();
          console.log('✅ Speech recognized:', transcript);
          
          if (transcript) {
            const response = getResponse(transcript);
            setCatMessage(response);
            speakText(response);
          } else {
            setCatMessage("🤔 I heard something but couldn't understand. Try again!");
            setCatExpression("curious");
            speakText("I heard something but couldn't understand. Try again!");
          }
        }
      };

      // Handle recognition start
      recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
        setListening(true);
        setCatExpression("curious");
      };

      // Handle recognition end
      recognition.onend = () => {
        console.log('🛑 Speech recognition ended');
        setListening(false);
        
        // If we ended without getting results, show helpful message
        setTimeout(() => {
          if (catMessage === "🎤 Listening... Speak now!") {
            setCatMessage("👂 Didn't hear anything. Try speaking louder or closer to your mic!");
            setCatExpression("curious");
          }
        }, 100);
      };

      // Handle errors with specific messages
      recognition.onerror = (event: any) => {
        console.log('❌ Speech recognition error:', event.error);
        setListening(false);
        
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            setCatMessage("🚫 Please allow microphone access! Check the 🔒 icon in your address bar!");
            setCatExpression("curious");
            break;
          case 'no-speech':
            setCatMessage("🤫 I didn't hear anything. Make sure your microphone is working and try again!");
            setCatExpression("curious");
            break;
          case 'audio-capture':
            setCatMessage("🎤 Microphone not found! Check if your mic is connected and try again!");
            setCatExpression("curious");
            break;
          case 'network':
            setCatMessage("🌐 Network error! Check your internet connection and try again!");
            setCatExpression("curious");
            break;
          case 'aborted':
            setCatMessage("⏹️ Speech recognition was stopped. Click the button to try again!");
            setCatExpression("curious");
            break;
          default:
            setCatMessage(`❓ Speech error (${event.error}). Try clicking me instead! 😸`);
            setCatExpression("curious");
        }
      };

      // Start recognition
      console.log('🚀 Starting speech recognition...');
      recognition.start();

      // Auto-stop after 10 seconds to prevent hanging
      setTimeout(() => {
        if (listening) {
          console.log('⏰ Auto-stopping recognition after 10 seconds');
          try {
            recognition.stop();
          } catch (e) {
            console.log('Error stopping recognition:', e);
          }
          setListening(false);
        }
      }, 10000);

    } catch (error) {
      console.error('💥 Recognition setup error:', error);
      setListening(false);
      setCatMessage("💥 Oops! Something went wrong with speech recognition. Try clicking me instead! 😸");
      setCatExpression("curious");
    }
  };

  // Dance function
  const startDance = () => {
    setIsDancing(true);
    setCatMessage("🎵 Let's dance! Watch me move! 💃");
    setCatExpression("excited");
    speakText("Let's dance! Watch me move!");
    
    // Dance sequence
    const danceSteps: { expression: keyof typeof expressions, delay: number }[] = [
      { expression: "playful", delay: 500 },
      { expression: "excited", delay: 1000 },
      { expression: "happy", delay: 1500 },
      { expression: "love", delay: 2000 },
      { expression: "playful", delay: 2500 }
    ];
    
    danceSteps.forEach(step => {
      setTimeout(() => {
        setCatExpression(step.expression);
      }, step.delay);
    });
    
    setTimeout(() => {
      setIsDancing(false);
      setCatMessage("That was fun! Let's dance again! ✨");
      setCatExpression("happy");
    }, 3000);
    
    return "🎵 Let's dance! Watch me move! 💃";
  };

  // Click interactions
  const handleCatClick = () => {
    const clickMessages: { text: string; expression: keyof typeof expressions }[] = [
      { text: "Purr purr! I love pets! 😸", expression: "happy" },
      { text: "Meow! That tickles! 😹", expression: "playful" },
      { text: "More pets please! 🐾", expression: "love" },
      { text: "I'm so happy! Keep going! ✨", expression: "excited" },
      { text: "You're the best human ever! 💕", expression: "love" },
      { text: "Hehe! Do that again! 😸", expression: "playful" }
    ];
    
    const randomMsg = clickMessages[Math.floor(Math.random() * clickMessages.length)];
    setCatMessage(randomMsg.text);
    setCatExpression(randomMsg.expression);
    speakText(randomMsg.text);
    
    // Random wiggle
    if (Math.random() > 0.6) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const currentExpression = expressions[catExpression];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-800 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
      
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      {/* Title */}
      <h1 className="absolute top-6 text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
        🐱 Talking Tom 🐱
      </h1>

      {/* Tom the cat */}
      <div className="relative z-10 mb-8">
        <div
          onClick={handleCatClick}
          className={`
            w-56 h-56 flex items-center justify-center text-8xl rounded-full cursor-pointer
            bg-gradient-to-br ${currentExpression.color} 
            shadow-[0_0_50px_rgba(255,255,255,0.3)]
            transition-all duration-300 hover:scale-105
            ${isAnimating ? 'animate-bounce' : ''}
            ${isDancing ? 'animate-spin' : ''}
          `}
        >
          <div className={`transition-transform duration-200 ${isAnimating ? 'scale-110' : ''}`}>
            {currentExpression.face}
          </div>
        </div>
      </div>

      {/* Speech bubble */}
      <div className="relative max-w-lg mx-4 mb-8">
        <div className="bg-white/95 backdrop-blur-sm text-gray-800 rounded-3xl p-6 shadow-2xl relative">
          <p className="text-center text-lg font-medium">{catMessage}</p>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-transparent border-b-white/95"></div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex flex-col sm:flex-row gap-4 z-10">
        <button
          onClick={startListening}
          disabled={listening}
          className={`
            px-8 py-4 rounded-full text-white font-bold text-lg shadow-xl
            transition-all duration-200 transform hover:scale-105
            ${listening 
              ? 'bg-red-500 animate-pulse cursor-not-allowed opacity-75' 
              : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
            }
          `}
        >
          {listening ? '🎤 Listening...' : '🎤 Talk to Tom'}
        </button>

        <button
          onClick={startDance}
          disabled={isDancing}
          className={`
            px-8 py-4 rounded-full text-white font-bold text-lg shadow-xl
            transition-all duration-200 transform hover:scale-105
            ${isDancing
              ? 'bg-purple-500 animate-pulse cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
            }
          `}
        >
          {isDancing ? '💃 Dancing...' : '💃 Dance'}
        </button>
      </div>
    </div>
  );
}