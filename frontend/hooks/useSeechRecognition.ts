// /hooks/useSpeechRecognition.ts

import { useState, useEffect, useRef } from "react";

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  const recognitionRef = useRef<any>(null);
  const hasFatalError = useRef(false); // once set, never tries browser API again

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      // API doesn’t exist at all
      setHasRecognitionSupport(false);
      return;
    }

    let recognition: any;

    try {
      recognition = new SpeechRecognitionConstructor();
    } catch (e) {
      console.warn("Failed to instantiate SpeechRecognition:", e);
      setHasRecognitionSupport(false);
      return;
    }

    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (
        event.error === "network" ||
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        // these errors mean browser's speech recognition is unusable
        hasFatalError.current = true;
        setHasRecognitionSupport(false);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    // Try a lightweight test only if not already known to be broken
    // But don’t call recognition.start if it will immediately error
    // Skip test or wrap in try/catch
    try {
      recognition.start();
      recognition.stop();
      // If no immediate error, assume ok
      setHasRecognitionSupport(true);
    } catch (err) {
      console.warn("Speech recognition initial test failed:", err);
      setHasRecognitionSupport(false);
      hasFatalError.current = true;
    }

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // nothing
      }
    };
  }, []);

  const startListening = () => {
    if (
      recognitionRef.current &&
      !isListening &&
      hasRecognitionSupport &&
      !hasFatalError.current
    ) {
      setTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        // On any start error, disable support
        hasFatalError.current = true;
        setHasRecognitionSupport(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping speech recognition:", err);
      }
      setIsListening(false);
    }
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: hasRecognitionSupport && !hasFatalError.current,
  };
};
