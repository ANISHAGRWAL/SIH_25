"use client";

import { useState } from "react";
import { submitTestScore } from "@/actions/test";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const questions = [
  "In the last month, how often have you been upset because of something that happened unexpectedly?",
  "In the last month, how often have you felt that you were unable to control the important things in your life?",
  "In the last month, how often have you felt nervous and stressed?",
  "In the last month, how often have you felt confident about your ability to handle your personal problems?",
  "In the last month, how often have you felt that things were going your way?",
  "In the last month, how often have you found that you could not cope with all the things that you had to do?",
  "In the last month, how often have you been able to control irritations in your life?",
  "In the last month, how often have you felt that you were on top of things?",
  "In the last month, how often have you been angered because of things that happened that were outside of your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
];

const options = [
  { value: 0, label: "Never" },
  { value: 1, label: "Almost never" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Fairly often" },
  { value: 4, label: "Very often" },
];

// Questions 4, 5, 7, 8 need reverse scoring (0=4, 1=3, 2=2, 3=1, 4=0)
const reverseScoreQuestions = [3, 4, 6, 7]; // 0-indexed

// ---------------------- PSS Result Interpretation ----------------------
const getResultInterpretation = (score: number) => {
  if (score <= 13)
    return {
      level: "Low",
      color: "text-green-600",
      bgColor: "bg-green-50",
      message: "You're managing stress well. Keep up your healthy coping strategies!",
    };
  if (score <= 26)
    return {
      level: "Moderate",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      message: "You're experiencing moderate stress. Consider stress management techniques.",
    };
  return {
    level: "High",
    color: "text-red-600",
    bgColor: "bg-red-50",
    message: "You're experiencing high perceived stress. Consider seeking support and stress reduction strategies.",
  };
};

// ---------------------- PSS Recommendation System ----------------------
const getRedirectionUrls = (score: number) => {
  if (score <= 13)
    return [
      {
        title: "You scored Low Stress",
        message:
          "Great! Keep maintaining your mental wellness. Explore journaling, yoga, and blogs to stay balanced.",
        buttons: [
          { name: "Confidential Journaling", url: "/mind-log" },
          { name: "Surya Namaskar (Yoga)", url: "/wellness/surya-namaskar" },
          { name: "Simple Habits to Boost Your Mental Wellness Daily (Blog)", url: "/blogs/simple-habit-to-boost-your-mind" },
        ],
      },
    ];

  if (score <= 26)
    return [
      {
        title: "You scored Moderate Stress",
        message:
          "You may benefit from motivational support, mood detection, and specific yoga/blogs to manage stress effectively.",
        buttons: [
          { name: "Motivational Chatbot", url: "/chatbot" },
          { name: "Face Mood Detection", url: "/facial-mood-detection" },
          { name: "Mindful Body Scan", url: "/wellness/mindful-body-scan" },
          { name: "When Mental Health Makes Connections Harder (Blog)", url: "/blogs/mental-health-and-connection" },
        ],
      },
    ];

  // High Stress: 27+
  return [
    {
      title: "You scored High Stress",
      message:
        "Professional help is strongly recommended. You can book a counselor, use AI voice support, and explore yoga and blogs for support.",
      buttons: [
        { name: "One-Tap Counselor Booking", url: "/book-session" },
        { name: "AI Calling Bot (Voice Support)", url: "/ai-calling" },
        { name: "Corpse Pose (Yoga)", url: "/wellness/yoga/5" },
        { name: "Journaling for Clarity (Blog)", url: "/blogs/journaling-for-clarity" },
        { name: "Resilience Building: How to Bounce Back from Setbacks Stronger (Blog)", url: "/blogs/resilience-building" },
      ],
    },
  ];
};

export default function PSSTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleAnswer = async (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = newAnswers.reduce((sum, answer, index) => {
        if (reverseScoreQuestions.includes(index)) return sum + (4 - answer);
        return sum + answer;
      }, 0);

      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        setShowResults(true);
        return;
      }

      setIsSubmitting(true);
      const res = await submitTestScore("pss", finalScore, token);

      if (res.ok) {
        toast.success("Your PSS results have been saved!");
      } else {
        toast.error(res.error || "Failed to save results.");
      }

      setIsSubmitting(false);
      setShowResults(true);
    }
  };

  const calculateScore = () =>
    answers.reduce((sum, answer, index) => (reverseScoreQuestions.includes(index) ? sum + (4 - answer) : sum + answer), 0);

  const totalScore = calculateScore();
  const result = getResultInterpretation(totalScore);
  const redirectionUrls = getRedirectionUrls(totalScore);

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">
              PSS Assessment Complete
            </h2>
            <p className="text-slate-600">Your Perceived Stress Scale Results</p>
          </div>
          {isSubmitting && <p className="text-center text-slate-600">Saving your results...</p>}

          {/* Results Card */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-8">
            <div className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center text-white mb-4 shadow-lg">
                  <span className="text-2xl font-bold">{totalScore}</span>
                </div>
                <div className="text-sm text-slate-600">
                  Total Score out of 40
                </div>
              </div>

              {/* Result Level */}
              <div className={`rounded-2xl ${result.bgColor} p-6 text-center`}>
                <div className={`text-2xl font-bold ${result.color} mb-2`}>
                  {result.level} Perceived Stress
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {result.message}
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs md:text-sm">
                <div className="p-2 md:p-3 bg-green-50 rounded-xl">
                  <div className="font-semibold text-green-600">Low</div>
                  <div className="text-green-700">0-13</div>
                </div>
                <div className="p-2 md:p-3 bg-yellow-50 rounded-xl">
                  <div className="font-semibold text-yellow-600">Moderate</div>
                  <div className="text-yellow-700">14-26</div>
                </div>
                <div className="p-2 md:p-3 bg-red-50 rounded-xl">
                  <div className="font-semibold text-red-600">High</div>
                  <div className="text-red-700">27-40</div>
                </div>
              </div>
            </div>
          </div>

          {/* Redirection Buttons */}
          {redirectionUrls &&
            redirectionUrls.map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="text-lg font-semibold">{item.title}</div>
                <p className="text-slate-600">{item.message}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {item.buttons.map((button, btnIndex) => (
                    <button
                      key={btnIndex}
                      onClick={() => router.replace(button.url)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
                    >
                      {button.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          {/* Back to Tests Button */}
          <div className="">
            <button
              disabled={isSubmitting}
              onClick={() => router.replace("/psych-tests")}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium disabled:opacity-50"
            >
              Back to tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------- Test Page ----------------------
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-semibold">
            PSS Assessment
          </h2>
          <p className="text-slate-600">
            Answer based on your feelings over the past month.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-400 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
              {questions[currentQuestion]}
            </h3>
          </div>

          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 text-left rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 group-hover:bg-blue-100 transition-colors" />
                  <span className="font-medium text-slate-700 group-hover:text-blue-700">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}