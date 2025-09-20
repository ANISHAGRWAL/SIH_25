"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Heart, Brain, Pause, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

const techniques = [
  {
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
  },
  {
    id: 2,
    name: "Yoga",
    duration: "5-15 minutes",
    emoji: "🧘",
    benefits: "Improves flexibility, strength, and mental clarity",
    isYogaCategory: true,
    color: "from-green-100 to-emerald-100",
  },
  {
    id: 3,
    name: "Morning Sun Salutation",
    duration: "8 minutes",
    emoji: "🌅",
    benefits: "Energizes body and improves focus",
    instructions: [
      "Stand tall with palms together at chest",
      "Inhale, sweep arms overhead",
      "Exhale, fold forward touching toes",
      "Step back into plank position",
      "Lower to ground, then cobra pose",
      "Return to standing and repeat",
    ],
    color: "from-orange-100 to-yellow-100",
  },
  {
    id: 4,
    name: "Box Breathing",
    duration: "4 minutes",
    emoji: "📦",
    benefits: "Improves concentration and reduces stress",
    instructions: [
      "Sit in a comfortable position",
      "Exhale all air from your lungs",
      "Inhale through nose for 4 counts",
      "Hold breath for 4 counts",
      "Exhale through mouth for 4 counts",
      "Hold empty for 4 counts, repeat",
    ],
    color: "from-purple-100 to-pink-100",
  },
  // {
  //   id: 5,
  //   name: "Legs Up the Wall",
  //   duration: "10 minutes",
  //   emoji: "🦵",
  //   benefits: "Reduces fatigue and calms nervous system",
  //   instructions: [
  //     "Lie on your back near a wall",
  //     "Extend legs up against the wall",
  //     "Arms relaxed at your sides",
  //     "Close your eyes and breathe naturally",
  //     "Focus on releasing tension",
  //     "Stay for 5-15 minutes",
  //   ],
  //   color: "from-teal-100 to-cyan-100",
  // },
  {
    id: 6,
    name: "Mindful Body Scan",
    duration: "7 minutes",
    emoji: "🔍",
    benefits: "Increases body awareness and relaxation",
    instructions: [
      "Lie down comfortably on your back",
      "Close your eyes and breathe naturally",
      "Start from your toes, notice sensations",
      "Slowly move attention up your body",
      "Acknowledge tension without judgment",
      "End at the top of your head",
    ],
    color: "from-slate-100 to-gray-100",
  },
]

export default function WellnessPage() {
  const [selectedTechnique, setSelectedTechnique] = useState<(typeof techniques)[0] | null>(null)
  const router = useRouter()

  // New state variables for 4-7-8 breathing
  const [isBreathingActive, setIsBreathingActive] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState('ready') // 'ready', 'inhale', 'hold', 'exhale'
  const [countdown, setCountdown] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [totalCycles] = useState(4)

  // Breathing logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isBreathingActive && selectedTechnique?.id === 1) {
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
  }, [isBreathingActive, breathingPhase, totalCycles, selectedTechnique?.id]);

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

  const startTechnique = (technique: (typeof techniques)[0]) => {
    if (technique.isYogaCategory) {
      router.push("/wellness/yoga")
      return
    }
    setSelectedTechnique(technique)
  }

  if (selectedTechnique) {
    return (
      <div className="min-h-screen bg-blue-50 p-4">
        <Button
          variant="ghost"
          onClick={() => setSelectedTechnique(null)}
          className="mb-6 text-slate-600 hover:text-slate-900"
        >
          ← Back to Techniques
        </Button>
        <div className="max-w-2xl mx-auto">


          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{selectedTechnique.emoji}</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{selectedTechnique.name}</h1>
            <div className="flex items-center justify-center gap-4 text-slate-600 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{selectedTechnique.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>Wellness</span>
              </div>
            </div>
            <p className="text-slate-600 mb-6">{selectedTechnique.benefits}</p>
          </div>

          {selectedTechnique.id === 1 ? (
            // Interactive 4-7-8 Breathing
            <>
              <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
                <CardContent className="p-8 text-center">
                  <BreathingCircle />

                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-slate-800 mb-2">
                      {getPhaseText()}
                    </h3>
                    <p className="text-slate-600">
                      {breathingPhase === 'complete'
                        ? 'Great job! You completed all cycles.'
                        : `Cycle ${currentCycle + 1} of ${totalCycles}`
                      }
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 mb-6">
                    {!isBreathingActive && breathingPhase !== 'complete' ? (
                      <Button
                        onClick={startBreathing}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-full"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start Breathing
                      </Button>
                    ) : breathingPhase !== 'complete' ? (
                      <Button
                        onClick={pauseBreathing}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-full"
                      >
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    ) : null}

                    <Button
                      onClick={resetBreathing}
                      variant="outline"
                      className="px-6 py-3 rounded-full"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {breathingPhase === 'ready' && (
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>• Inhale for 4 seconds</p>
                      <p>• Hold for 7 seconds</p>
                      <p>• Exhale for 8 seconds</p>
                      <p>• Repeat for 4 cycles</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            // Original static content for other techniques
            <>
              <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
                    <Brain className="h-5 w-5" />
                    Step-by-Step Instructions
                  </h3>
                  <ol className="space-y-3">
                    {selectedTechnique.instructions?.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-slate-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  <Play className="h-5 w-5 mr-2" />
                  Begin Practice
                </Button>
                <p className="text-slate-600 mt-3">Take your time and listen to your body</p>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Yoga & Meditation</h1>
          <p className="text-xl text-slate-600 mb-2">Your 5-minute mental detox</p>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Take a break from your studies and nurture your mental well-being with these simple, effective techniques
            designed specifically for busy students.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Quick Wellness Techniques</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techniques.map((technique) => (
              <Card
                key={technique.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br ${technique.color} border border-gray-200`}
                onClick={() => startTechnique(technique)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{technique.emoji}</div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{technique.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-slate-600 mb-3">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{technique.duration}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{technique.benefits}</p>
                  <Button size="sm" className="bg-white/90 hover:bg-white text-slate-700 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                    Try Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-xl">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">Ready to Begin Your Wellness Journey?</h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            Begin your journey to inner calm and clarity. All you need is a few minutes and a quiet space.
          </p>
          <Button
            className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => startTechnique(techniques[0])}
          >
            <Play className="h-5 w-5 mr-2" />
            Start Now
          </Button>
        </div>
      </div>
    </div>
  )
}