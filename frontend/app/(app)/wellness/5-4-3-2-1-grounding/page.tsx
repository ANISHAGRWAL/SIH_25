"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Heart, Brain, RotateCcw } from "lucide-react"

export default function GroundingExercisePage() {
  // State variables for 5-4-3-2-1 Grounding
  const [isGroundingActive, setIsGroundingActive] = useState(false)
  const [currentGroundingStep, setCurrentGroundingStep] = useState(0)
  const [groundingPhase, setGroundingPhase] = useState('ready') // 'ready', 'active', 'complete'

  const technique = {
    id: 4,
    name: "5-4-3-2-1 Grounding",
    duration: "3-5 minutes",
    emoji: "🧭",
    benefits: "Reduces anxiety, improves focus, and grounds you in the present moment",
    instructions: [
      "Sit comfortably and take three deep breaths",
      "Look around and name 5 things you can see",
      "Listen carefully and identify 4 things you can hear",
      "Notice and name 3 things you can touch or feel",
      "Identify 2 things you can smell",
      "Name 1 thing you can taste",
      "Take another deep breath and notice how you feel now",
    ],
    color: "from-purple-100 to-pink-100",
  }

  // Grounding helper functions
  const startGrounding = () => {
    setIsGroundingActive(true);
    setGroundingPhase('active');
    setCurrentGroundingStep(0);
  };

  const nextGroundingStep = () => {
    const nextStep = currentGroundingStep + 1;
    if (nextStep >= technique.instructions.length) {
      setIsGroundingActive(false);
      setGroundingPhase('complete');
    } else {
      setCurrentGroundingStep(nextStep);
    }
  };

  const resetGrounding = () => {
    setIsGroundingActive(false);
    setGroundingPhase('ready');
    setCurrentGroundingStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-25 to-yellow-50 p-4">
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="mb-6 text-slate-600 hover:text-slate-900"
      >
        ← Back to Techniques
      </Button>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{technique.emoji}</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{technique.name}</h1>
          <div className="flex items-center justify-center gap-4 text-slate-600 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{technique.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>Wellness</span>
            </div>
          </div>
          <p className="text-slate-600 mb-6">{technique.benefits}</p>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🧭</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Grounding Exercise</h3>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Brain className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-purple-100">Connect with your senses and find your center</p>
            </div>
            
            <div className="p-8 text-center">
              {groundingPhase === 'ready' && (
                <div className="mb-8">
                  <div className="text-6xl mb-4">🧭</div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    Ready to Ground Yourself?
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    This technique uses your 5 senses to bring you into the present moment and reduce anxiety.
                  </p>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border border-purple-200 mb-6">
                    <h4 className="text-lg font-semibold text-purple-800 mb-4">How it works:</h4>
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <div className="bg-white/70 p-3 rounded-lg">
                        <div className="text-2xl mb-1">👁️</div>
                        <div className="font-semibold text-purple-800">5 See</div>
                      </div>
                      <div className="bg-white/70 p-3 rounded-lg">
                        <div className="text-2xl mb-1">👂</div>
                        <div className="font-semibold text-purple-800">4 Hear</div>
                      </div>
                      <div className="bg-white/70 p-3 rounded-lg">
                        <div className="text-2xl mb-1">✋</div>
                        <div className="font-semibold text-purple-800">3 Touch</div>
                      </div>
                      <div className="bg-white/70 p-3 rounded-lg">
                        <div className="text-2xl mb-1">👃</div>
                        <div className="font-semibold text-purple-800">2 Smell</div>
                      </div>
                      <div className="bg-white/70 p-3 rounded-lg">
                        <div className="text-2xl mb-1">👅</div>
                        <div className="font-semibold text-purple-800">1 Taste</div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={startGrounding}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Begin Practice
                  </Button>
                </div>
              )}

              {groundingPhase === 'active' && (
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
                    <span className="text-3xl text-white">
                      {currentGroundingStep === 0 ? '🧘' : 
                      currentGroundingStep === 1 ? '👁️' : 
                      currentGroundingStep === 2 ? '👂' : 
                      currentGroundingStep === 3 ? '✋' : 
                      currentGroundingStep === 4 ? '👃' : 
                      currentGroundingStep === 5 ? '👅' : '😌'}
                    </span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 mb-6">
                    <div className="text-lg font-semibold text-purple-800 mb-2">
                      Step {currentGroundingStep + 1} of {technique.instructions.length}
                    </div>
                    <div className="text-xl text-slate-800 mb-4">
                      {technique.instructions[currentGroundingStep]}
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentGroundingStep + 1) / technique.instructions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={nextGroundingStep}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full"
                    >
                      {currentGroundingStep === technique.instructions.length - 1 ? 'Complete' : 'Next Step'}
                    </Button>
                    <Button
                      onClick={resetGrounding}
                      variant="outline"
                      className="px-6 py-3 rounded-full border-2 border-purple-200"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              )}

              {groundingPhase === 'complete' && (
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-8 border border-emerald-200">
                  <div className="text-4xl mb-4">🌟</div>
                  <h4 className="text-2xl font-bold text-emerald-800 mb-3">Grounding Complete!</h4>
                  <p className="text-emerald-700 mb-4">
                    You've successfully connected with all your senses. Notice how much more present and calm you feel now.
                  </p>
                  <Button
                    onClick={resetGrounding}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-full"
                  >
                    Practice Again
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}