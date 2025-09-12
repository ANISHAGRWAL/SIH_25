"use client";

import { useState } from "react";
import { submitTestScore } from "@/actions/test";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// GAD-7 Questions
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

const getResultInterpretation = (score: number) => {
  if (score <= 4)
    return {
      level: "Minimal",
      color: "text-green-600",
      bgColor: "bg-green-50",
      message: "Your symptoms suggest minimal anxiety. Keep up your mental wellness strategies!",
    };
  if (score <= 9)
    return {
      level: "Mild",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      message: "You may be experiencing mild anxiety. Consider stress-reduction techniques.",
    };
  if (score <= 14)
    return {
      level: "Moderate",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      message: "Your symptoms suggest moderate anxiety. Professional support is recommended.",
    };
  return {
    level: "Severe",
    color: "text-red-700",
    bgColor: "bg-red-50",
    message: "Your symptoms suggest severe anxiety. Please contact a mental health professional immediately.",
  };
};

export default function GAD7TestPage() {
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
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">GAD-7 Assessment Complete</h1>
            <p className="text-base md:text-lg text-gray-500">Your Anxiety Screening Results</p>
          </div>
          {isSubmitting && <p className="text-center text-slate-600">Saving your results...</p>}

          <div className="rounded-2xl md:rounded-3xl bg-white shadow-lg md:shadow-2xl ring-1 ring-gray-100 p-6 md:p-8 space-y-6 md:space-y-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg md:shadow-xl">
                  <span className="text-3xl md:text-4xl font-bold">{totalScore}</span>
                </div>
                <div className="text-sm md:text-lg font-medium text-gray-600">Total Score out of 21</div>
              </div>

              <div className={`rounded-2xl ${result.bgColor} p-6 text-center border border-dashed border-gray-300`}>
                <div className={`text-xl md:text-3xl font-bold ${result.color} mb-2`}>
                  {result.level} Anxiety
                </div>
                <p className="text-sm md:text-lg text-gray-700 leading-relaxed">{result.message}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base md:text-xl font-semibold text-gray-800">Score Interpretation</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 text-center">
                  <div className="p-3 md:p-4 bg-green-100 rounded-lg md:rounded-xl">
                    <div className="font-bold text-green-700 text-sm">Minimal</div>
                    <div className="text-xs md:text-sm text-green-800">0-4</div>
                  </div>
                  <div className="p-3 md:p-4 bg-yellow-100 rounded-lg md:rounded-xl">
                    <div className="font-bold text-yellow-700 text-sm">Mild</div>
                    <div className="text-xs md:text-sm text-yellow-800">5-9</div>
                  </div>
                  <div className="p-3 md:p-4 bg-orange-100 rounded-lg md:rounded-xl">
                    <div className="font-bold text-orange-700 text-sm">Moderate</div>
                    <div className="text-xs md:text-sm text-orange-800">10-14</div>
                  </div>
                  <div className="p-3 md:p-4 bg-red-100 rounded-lg md:rounded-xl">
                    <div className="font-bold text-red-700 text-sm">Severe</div>
                    <div className="text-xs md:text-sm text-red-800">15-21</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Updated Action Buttons to match PHQ-9 style */}
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
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">GAD-7 Assessment</h1>
          <p className="text-sm md:text-lg text-gray-500">Over the last 2 weeks, how often have you been bothered by the following problem?</p>
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