"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Heart, Brain, Pause, RotateCcw, Sparkles } from "lucide-react"

export default function BreathingExercisePage() {
  // State variables for 4-7-8 breathing
  const [isBreathingActive, setIsBreathingActive] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState('ready') // 'ready', 'inhale', 'hold', 'exhale'
  const [countdown, setCountdown] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [totalCycles] = useState(4)

  const technique = {
    id: 1,
    name: "4-7-8 Breathing",
    duration: "3 minutes",
    emoji: "🌬️",
    benefits: "Reduces anxiety and promotes sleep",
    instructions: [
      "Sit comfortably with your back straight",
      "Exhale completely through your mouth",
      "Inhale through nose for 4 counts",
      "Hold breath for 7 counts",
      "Exhale through mouth for 8 counts",
      "Repeat 3-4 cycles",
    ],
    color: "from-blue-100 to-indigo-100",
  }

  // Breathing logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isBreathingActive) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Move to next phase
            if (breathingPhase === 'ready') {
              setBreathingPhase('inhale');
              return 4;
            } else if (breathingPhase === 'inhale') {
              setBreathingPhase('hold');
              return 7;
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale');
              return 8;
            } else if (breathingPhase === 'exhale') {
              setCurrentCycle(cycle => {
                const newCycle = cycle + 1;
                if (newCycle >= totalCycles) {
                  setIsBreathingActive(false);
                  setBreathingPhase('complete');
                  return 0;
                }
                setBreathingPhase('inhale');
                return newCycle;
              });
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isBreathingActive, breathingPhase, totalCycles]);

  // Helper functions
  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathingPhase('inhale');
    setCountdown(4);
    setCurrentCycle(0);
  };

  const pauseBreathing = () => {
    setIsBreathingActive(!isBreathingActive);
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('ready');
    setCountdown(0);
    setCurrentCycle(0);
  };

  const getPhaseText = () => {
    switch (breathingPhase) {
      case 'ready': return 'Get Ready';
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'complete': return 'Complete!';
      default: return 'Get Ready';
    }
  };

  const getPhaseColor = () => {
    switch (breathingPhase) {
      case 'inhale': return 'from-green-400 to-blue-500';
      case 'hold': return 'from-yellow-400 to-orange-500';
      case 'exhale': return 'from-purple-400 to-pink-500';
      case 'complete': return 'from-emerald-400 to-teal-500';
      default: return 'from-blue-400 to-blue-500';
    }
  };

  // Breathing animation component
  const BreathingCircle = () => {
    const getScale = () => {
      switch (breathingPhase) {
        case 'inhale': return 'scale-150';
        case 'hold': return 'scale-150';
        case 'exhale': return 'scale-100';
        default: return 'scale-100';
      }
    };

    return (
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-br ${getPhaseColor()}
            transition-transform duration-1000 ease-in-out ${getScale()}
            shadow-2xl opacity-80`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              {breathingPhase === 'complete' ? '✓' : countdown || ''}
            </div>
          </div>
        </div>
      </div>
    );
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

        {/* Main Breathing Exercise Card */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🌬️</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Breathing Exercise</h3>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Heart className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-blue-100">Follow the rhythm and find your calm</p>
            </div>
            
            <div className="p-8 text-center">
              <BreathingCircle />

              <div className="mb-8">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  {getPhaseText()}
                </h3>
                <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-2 inline-block border border-blue-200">
                  <p className="text-slate-700 font-medium">
                    {breathingPhase === 'complete'
                      ? '🎉 Excellent! You completed all breathing cycles.'
                      : `Round ${currentCycle + 1} of ${totalCycles}`
                    }
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {!isBreathingActive && breathingPhase !== 'complete' ? (
                  <Button
                    onClick={startBreathing}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Begin Breathing
                  </Button>
                ) : breathingPhase !== 'complete' ? (
                  <Button
                    onClick={pauseBreathing}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                ) : null}

                <Button
                  onClick={resetBreathing}
                  variant="outline"
                  className="px-8 py-4 rounded-full text-lg border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {breathingPhase === 'ready' && (
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center justify-center gap-2">
                    <Brain className="h-5 w-5" />
                    How it Works
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
                      <div className="text-2xl mb-2">🫁</div>
                      <div className="font-semibold text-blue-800 mb-1">Inhale</div>
                      <div className="text-slate-600">4 seconds through nose</div>
                    </div>
                    <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
                      <div className="text-2xl mb-2">⏸️</div>
                      <div className="font-semibold text-blue-800 mb-1">Hold</div>
                      <div className="text-slate-600">7 seconds gently</div>
                    </div>
                    <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
                      <div className="text-2xl mb-2">💨</div>
                      <div className="font-semibold text-blue-800 mb-1">Exhale</div>
                      <div className="text-slate-600">8 seconds through mouth</div>
                    </div>
                    <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
                      <div className="text-2xl mb-2">🔄</div>
                      <div className="font-semibold text-blue-800 mb-1">Repeat</div>
                      <div className="text-slate-600">Complete 4 cycles</div>
                    </div>
                  </div>
                </div>
              )}

              {breathingPhase === 'complete' && (
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 border border-emerald-200">
                  <div className="text-4xl mb-3">✨</div>
                  <h4 className="text-xl font-bold text-emerald-800 mb-2">Session Complete!</h4>
                  <p className="text-emerald-700">
                    Take a moment to notice how you feel. Your nervous system is now more balanced and calm.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Card */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Why 4-7-8 Breathing Works
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="font-semibold text-blue-800 mb-2">😴 Better Sleep</div>
                <p className="text-slate-600">Activates the parasympathetic nervous system for relaxation</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="font-semibold text-blue-800 mb-2">😌 Reduced Anxiety</div>
                <p className="text-slate-600">Helps break the cycle of anxious thoughts and feelings</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="font-semibold text-blue-800 mb-2">🎯 Better Focus</div>
                <p className="text-slate-600">Increases oxygen flow and mental clarity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}