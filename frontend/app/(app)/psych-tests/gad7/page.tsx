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
      <div className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="max-w-2xl w-full mx-auto space-y-6 md:space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">GAD-7 Assessment Complete</h1>
            <p className="text-base md:text-lg text-gray-500">Your Anxiety Screening Results</p>
          </div>

          <div className="rounded-2xl md:rounded-3xl bg-white shadow-lg md:shadow-2xl ring-1 ring-gray-100 p-6 md:p-8 space-y-6 md:space-y-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg md:shadow-xl">
                  <span className="text-3xl md:text-4xl font-bold">{totalScore}</span>
                </div>
                <div className="text-sm md:text-lg font-medium text-gray-600">Total Score out of 27</div>
              </div>

              <div className={`rounded-2xl ${result.bgColor} p-6 text-center border border-dashed border-gray-300`}>
                <div className={`text-xl md:text-3xl font-bold ${result.color} mb-2`}>
                  {result.level} Depression
                </div>
                <p className="text-sm md:text-lg text-gray-700 leading-relaxed">{result.message}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base md:text-xl font-semibold text-gray-800">Score Interpretation</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:gap-4 text-center">
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
                    <div className="font-bold text-red-700 text-sm">Mod. Severe</div>
                    <div className="text-xs md:text-sm text-red-800">15-19</div>
                  </div>
                  <div className="p-3 md:p-4 bg-red-200 rounded-lg md:rounded-xl">
                    <div className="font-bold text-red-800 text-sm">Severe</div>
                    <div className="text-xs md:text-sm text-red-900">20-27</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetTest}
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg md:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold text-sm md:text-lg"
            >
              Retake Test
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 font-semibold text-sm md:text-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
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
  )
}