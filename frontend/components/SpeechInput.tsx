// /components/SpeechInput.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Loader2 } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSeechRecognition";
import { getTextFromSpeech } from "@/actions/student";

type Props = {
  onTranscript: (text: string) => void;
  disabled?: boolean;
};

export default function SpeechInput({ onTranscript, disabled = false }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  // When browser speech recog finishes (i.e. isListening goes false), send transcript
  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript);
    }
  }, [transcript, isListening, onTranscript]);

  // Fallback using MediaRecorder + your backend API if browser speech recog not available or fails
  const handleFallbackStart = async () => {
    if (disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        // Stop the tracks
        stream.getTracks().forEach((track) => track.stop());

        setIsUploading(true);
        try {
          const audioBlob = new Blob(recordedChunksRef.current, {
            type: "audio/webm",
          });

          const token = localStorage.getItem("token") || "";

          const res = await getTextFromSpeech(token, audioBlob);

          const data = res.data;
          if (data.text) {
            onTranscript(data.text);
          } else {
            console.warn("No transcription received from fallback API.");
          }
        } catch (error) {
          console.error("Fallback speech-to-text error:", error);
        } finally {
          setIsUploading(false);
        }
      };

      recorder.start();
      setIsRecording(true);

      // Automatically stop recording after some time (e.g., 10 seconds)
      setTimeout(() => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
        setIsRecording(false);
      }, 10000);
    } catch (err) {
      console.error("Error accessing microphone in fallback:", err);
    }
  };

  const handleMicClick = () => {
    if (disabled || isUploading) return;

    // If browser recognize is usable, use that
    if (hasRecognitionSupport) {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    } else {
      // fallback
      console.log("Using fallback speech recognition");
      if (isRecording) {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      } else {
        handleFallbackStart();
      }
    }
  };

  const isActive = hasRecognitionSupport ? isListening : isRecording;

  return (
    <button
      onClick={handleMicClick}
      disabled={disabled || isUploading}
      className={`p-2 sm:p-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-red-500 text-white"
          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
      } flex items-center justify-center h-[40px] sm:h-[52px]`}
    >
      {isUploading ? (
        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
      ) : (
        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
    </button>
  );
}
