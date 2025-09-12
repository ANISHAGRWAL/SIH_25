"use client"

import { useState } from "react"

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
]

const options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
]

const getResultInterpretation = (score: number) => {
  if (score <= 4)
    return {
      level: "Minimal",
      color: "text-green-600",
      bgColor: "bg-green-50",
      message: "Your symptoms suggest minimal depression. Keep maintaining your mental wellness!",
    }
  if (score <= 9)
    return {
      level: "Mild",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      message: "You may be experiencing mild depression. Consider speaking with a counselor.",
    }
  if (score <= 14)
    return {
      level: "Moderate",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      message: "Your symptoms suggest moderate depression. Professional support is recommended.",
    }
  if (score <= 19)
    return {
      level: "Moderately Severe",
      color: "text-red-600",
      bgColor: "bg-red-50",
      message: "You may be experiencing moderately severe depression. Please seek professional help.",
    }
  return {
    level: "Severe",
    color: "text-red-700",
    bgColor: "bg-red-50",
    message: "Your symptoms suggest severe depression. Please contact a mental health professional immediately.",
  }
}

export default function PHQ9TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const totalScore = answers.reduce((sum, answer) => sum + answer, 0)
  const result = getResultInterpretation(totalScore)

  const resetTest = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">PHQ-9 Assessment Complete</h2>
            <p className="text-slate-600">Your Depression Screening Results</p>
          </div>
          
          {/* Results Card */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-8">
            <div className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center text-white mb-4 shadow-lg">
                  <span className="text-2xl font-bold">{totalScore}</span>
                </div>
                <div className="text-sm text-slate-600">Total Score out of 27</div>
              </div>

              {/* Result Level */}
              <div className={`rounded-2xl ${result.bgColor} p-6 text-center`}>
                <div className={`text-2xl font-bold ${result.color} mb-2`}>
                  {result.level} Depression
                </div>
                <p className="text-slate-700 leading-relaxed">{result.message}</p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs md:text-sm">
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
                  <div className="font-semibold text-red-600">Mod. Severe</div>
                  <div className="text-red-700">15-19</div>
                </div>
                <div className="p-2 md:p-3 bg-red-100 rounded-xl md:col-span-1 col-span-2">
                  <div className="font-semibold text-red-700">Severe</div>
                  <div className="text-red-800">20-27</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
            >
              Retake Test
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg hover:shadow-md transition-all duration-200 font-medium"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-semibold">PHQ-9 Assessment</h2>
          <p className="text-slate-600">Over the last 2 weeks, how often have you been bothered by the following problem?</p>
        </div>
        
        {/* Progress Indicator */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
  )
}