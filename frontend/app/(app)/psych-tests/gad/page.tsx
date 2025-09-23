"use client";

import { useState } from "react";
import { submitTestScore } from "@/actions/test";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ---------------------- GAD-7 Questions ----------------------
const questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

const options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

// ---------------------- GAD-7 Result Interpretation ----------------------
const getResultInterpretation = (score: number) => {
  if (score <= 4)
    return {
      level: "Minimal",
      color: "text-green-600",
      bgColor: "bg-green-50",
      message:
        "Your symptoms suggest minimal anxiety. Keep up your mental wellness strategies!",
    };
  if (score <= 9)
    return {
      level: "Mild",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      message:
        "You may be experiencing mild anxiety. Consider stress-reduction techniques.",
    };
  if (score <= 14)
    return {
      level: "Moderate",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      message:
        "Your symptoms suggest moderate anxiety. Professional support is recommended.",
    };
  return {
    level: "Severe",
    color: "text-red-700",
    bgColor: "bg-red-50",
    message:
      "Your symptoms suggest severe anxiety. Please contact a mental health professional immediately.",
  };
};

// ---------------------- GAD-7 Recommendation System ----------------------
const getRedirectionUrls = (score: number) => {
  if (score <= 4)
    return [
      {
        title: "You scored Minimal Anxiety",
        message:
          "Great job! Keep maintaining your mental wellness. Explore games, yoga, and blogs to stay balanced.",
        buttons: [
          { name: "Gamified Wellbeing & Games", url: "/games" },
          { name: "Surya Namaskar (Yoga)", url: "/wellness/surya-namaskar" },
          { name: "Simple Habits to Boost Your Mental Wellness Daily (Blog)", url: "/blogs/simple-habit-to-boost-your-mind" },
        ],
      },
    ];
  if (score <= 9)
    return [
      {
        title: "You scored Mild Anxiety",
        message:
          "Consider using motivational chats, guided exercises, and blogs to help manage your anxiety.",
        buttons: [
          { name: "Motivational Chatbot", url: "/chatbot" },
          { name: "Child's Pose (Yoga)", url: "/wellness/yoga/1" },
          { name: "Digital Detox: How to Reset Your Mind (Blog)", url: "/blogs/digital-detox" },
        ],
      },
    ];
  if (score <= 14)
    return [
      {
        title: "You scored Moderate Anxiety",
        message:
          "Your anxiety may need professional support. Try yoga, journaling, and motivational resources.",
        buttons: [
          { name: "Motivational Chatbot", url: "/chatbot" },
          { name: "4-7-8 Breathing", url: "/wellness/4-7-8-breathing" },
          { name: "Journaling for Clarity (Blog)", url: "/blogs/journaling-for-clarity" },
        ],
      },
    ];
  // Severe: 15+
  return [
    {
      title: "You scored Severe Anxiety",
      message:
        "Professional help is strongly recommended. You can book a counselor, use AI voice support, and explore resources.",
      buttons: [
        { name: "Anonymous Volunteer Forum", url: "/exper-support" },
        { name: "One-Tap Counselor Booking", url: "/book-session" },
        { name: "AI Calling Bot (Voice Support)", url: "/ai-calling" },
        { name: "Resilience Building: How to Bounce Back from Setbacks Stronger (Blog)", url: "/blogs/resilience-building" },
        { name: "Corpse Pose (Yoga)", url: "/wellness/yoga/5" },
      ],
    },
  ];
};

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export default function GAD7TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAnswer = async (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);

      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        setShowResults(true);
        return;
      }

      setIsSubmitting(true);
      const res = await submitTestScore("gad", finalScore, token);

      if (res.ok) {
        toast.success("Your GAD-7 results have been saved!");
      } else {
        toast.error(res.error || "Failed to save results.");
      }

      setIsSubmitting(false);
      setShowResults(true);
    }
  };

  const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
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
              GAD-7 Assessment Complete
            </h2>
            <p className="text-slate-600">Your Anxiety Screening Results</p>
          </div>

          {/* Results Card */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-8">
            <div className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center text-white mb-4 shadow-lg">
                  <span className="text-2xl font-bold">{totalScore}</span>
                </div>
                <div className="text-sm text-slate-600">
                  Total Score out of 21
                </div>
              </div>

              {/* Result Level */}
              <div className={`rounded-2xl ${result.bgColor} p-6 text-center`}>
                <div className={`text-2xl font-bold ${result.color} mb-2`}>
                  {result.level} Anxiety
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {result.message}
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs md:text-sm">
                <div className="p-2 md:p-3 bg-green-50 rounded-xl">
                  <div className="font-semibold text-green-600">Minimal</div>
                  <div className="text-green-700">0-4</div>
                </div>
                <div className="p-2 md:p-3 bg-yellow-50 rounded-xl">
                  <div className="font-semibold text-yellow-600">Mild</div>
                  <div className="text-yellow-700">5-9</div>
                </div>
                <div className="p-2 md:p-3 bg-orange-50 rounded-xl">
                  <div className="font-semibold text-orange-600">Moderate</div>
                  <div className="text-orange-700">10-14</div>
                </div>
                <div className="p-2 md:p-3 bg-red-50 rounded-xl">
                  <div className="font-semibold text-red-600">Severe</div>
                  <div className="text-red-700">15-21</div>
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

          {/* Action Buttons */}
          <div className="">
            <button
              disabled={isSubmitting}
              onClick={() => {
                router.replace("/psych-tests");
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium disabled:opacity-50"
            >
              Back to tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-semibold">
            GAD-7 Assessment
          </h2>
          <p className="text-slate-600">
            Over the last 2 weeks, how often have you been bothered by the
            following problem?
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