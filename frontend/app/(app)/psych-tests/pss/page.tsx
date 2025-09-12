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
        if (reverseScoreQuestions.includes(index)) {
          return sum + (4 - answer);
        }
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

  const calculateScore = () => {
    return answers.reduce((sum, answer, index) => {
      if (reverseScoreQuestions.includes(index)) {
        return sum + (4 - answer);
      }
      return sum + answer;
    }, 0);
  };
  
  const totalScore = calculateScore();
  const result = getResultInterpretation(totalScore);

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="max-w-2xl w-full mx-auto space-y-6 md:space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">PSS Assessment Complete</h1>
            <p className="text-base md:text-lg text-gray-500">Your Perceived Stress Scale Results</p>
          </div>
          {isSubmitting && <p className="text-center text-slate-600">Saving your results...</p>}

          <div className="rounded-2xl md:rounded-3xl bg-white shadow-lg md:shadow-2xl ring-1 ring-gray-100 p-6 md:p-8 space-y-6 md:space-y-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg md:shadow-xl">
                  <span className="text-3xl md:text-4xl font-bold">{totalScore}</span>
                </div>
                <div className="text-sm md:text-lg font-medium text-gray-600">Total Score out of 40</div>
              </div>
              <div className={`rounded-2xl ${result.bgColor} p-6 text-center border border-dashed border-gray-300`}>
                <div className={`text-xl md:text-3xl font-bold ${result.color} mb-2`}>
                  {result.level} Perceived Stress
                </div>
                <p className="text-sm md:text-lg text-gray-700 leading-relaxed">{result.message}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-base md:text-xl font-semibold text-gray-800">Score Interpretation</h3>
                <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                  <div className="p-3 md:p-4 bg-green-100 rounded-lg md:rounded-xl">
                    <div className="font-bold text-green-700 text-sm">Low</div>
                    <div className="text-xs md:text-sm text-green-800">0-13</div>
                  </div>
                  <div className="p-3 md:p-4 bg-yellow-100 rounded-lg md:rounded-xl">
                    <div className="font-bold text-yellow-700 text-sm">Moderate</div>
                    <div className="text-xs md:text-sm text-yellow-800">14-26</div>
                  </div>
                  <div className="p-3 md:p-4 bg-red-100 rounded-lg md:rounded-xl">
                    <div className="font-bold text-red-700 text-sm">High</div>
                    <div className="text-xs md:text-sm text-red-800">27-40</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Updated Action Button to match GAD style */}
          <div className="flex justify-center items-center">
            <button
              disabled={isSubmitting}
              onClick={() => {
                router.push("/psych-tests");
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
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-gray-50">
      <div className="max-w-2xl w-full mx-auto space-y-6 md:space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">PSS Assessment</h1>
          <p className="text-sm md:text-lg text-gray-500">Answer based on your feelings over the past month.</p>
        </div>
        <div className="rounded-2xl md:rounded-3xl bg-white shadow-lg md:shadow-2xl ring-1 ring-gray-100 p-6 md:p-8 space-y-6 md:space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs md:text-base font-medium text-gray-600">
              <span className="text-xs md:text-base">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-xs md:text-base">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800 text-center leading-relaxed">
              {questions[currentQuestion]}
            </h2>
            <div className="space-y-3">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 md:p-5 text-left rounded-lg md:rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group flex items-center gap-4"
                >
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-100 transition-colors" />
                  <span className="font-medium text-gray-700 text-sm md:text-lg group-hover:text-blue-700">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}