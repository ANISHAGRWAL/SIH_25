"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Heart, Brain, Pause, RotateCcw, Sun, Sparkles } from "lucide-react"
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
    name: "Surya Namaskar",
    duration: "8 minutes",
    emoji: "🌅",
    benefits: "Energizes body, improves focus, and connects with solar energy",
    instructions: [
      "Pranamasana - Stand tall with palms together at chest in prayer position",
      "Hastauttanasana - Inhale, sweep arms overhead and arch back gently",
      "Uttanasana - Exhale, fold forward from hips, hands touching the ground",
      "Ashwa Sanchalanasana - Step left leg back into lunge, hands on ground",
      "Dandasana - Step right leg back into plank position, body straight",
      "Ashtanga Namaskara - Lower knees, chest, and chin to ground",
      "Bhujangasana - Slide forward into cobra pose, chest lifted",
      "Adho Mukha Svanasana - Tuck toes, lift hips into downward dog",
      "Ashwa Sanchalanasana - Step left foot forward into lunge",
      "Uttanasana - Bring right foot forward, fold over legs",
      "Hastauttanasana - Rise up, sweep arms overhead",
      "Pranamasana - Return to starting position with palms at heart center",
    ],
    color: "from-orange-100 to-yellow-100",
    isEnhanced: true,
  },
  {
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
  },
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

  // New state variables for 5-4-3-2-1 Grounding
  const [isGroundingActive, setIsGroundingActive] = useState(false)
  const [currentGroundingStep, setCurrentGroundingStep] = useState(0)
  const [groundingPhase, setGroundingPhase] = useState('ready') // 'ready', 'active', 'complete'

  // New state variables for Surya Namaskar
  const [isSuryaActive, setIsSuryaActive] = useState(false)
  const [currentSuryaStep, setCurrentSuryaStep] = useState(0)
  const [suryaPhase, setSuryaPhase] = useState('ready') // 'ready', 'active', 'complete'

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

  // Surya Namaskar logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isSuryaActive && selectedTechnique?.id === 3) {
      timer = setInterval(() => {
        setCurrentSuryaStep(step => {
          const nextStep = step + 1;
          if (nextStep >= selectedTechnique.instructions!.length) {
            setIsSuryaActive(false);
            setSuryaPhase('complete');
            return step;
          }
          return nextStep;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isSuryaActive, selectedTechnique?.id, selectedTechnique?.instructions]);

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

  // Grounding helper functions
  const startGrounding = () => {
    setIsGroundingActive(true);
    setGroundingPhase('active');
    setCurrentGroundingStep(0);
  };

  const nextGroundingStep = () => {
    const nextStep = currentGroundingStep + 1;
    if (nextStep >= selectedTechnique!.instructions!.length) {
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

  // Surya Namaskar helper functions
  const startSuryaNamaskar = () => {
    setIsSuryaActive(true);
    setSuryaPhase('active');
    setCurrentSuryaStep(0);
  };

  const resetSuryaNamaskar = () => {
    setIsSuryaActive(false);
    setSuryaPhase('ready');
    setCurrentSuryaStep(0);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-25 to-yellow-50 p-4">
        <Button
          variant="ghost"
          onClick={() => setSelectedTechnique(null)}
          className="mb-6 text-slate-600 hover:text-slate-900"
        >
          ← Back to Techniques
        </Button>
        <div className="max-w-4xl mx-auto">

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
            // Interactive 4-7-8 Breathing - Enhanced
            <>
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
            </>
          ) : selectedTechnique.id === 4 ? (
            // Interactive 5-4-3-2-1 Grounding - Enhanced
            <>
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
                            //  currentGroundingStep === 1 || currentGroundingStep === 2 || currentGroundingStep === 3 || currentGroundingStep === 4 ? '👁️' :
                             currentGroundingStep === 5 ? '👅' : '😌'}
                          </span>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 mb-6">
                          <div className="text-lg font-semibold text-purple-800 mb-2">
                            Step {currentGroundingStep + 1} of {selectedTechnique.instructions!.length}
                          </div>
                          <div className="text-xl text-slate-800 mb-4">
                            {selectedTechnique.instructions![currentGroundingStep]}
                          </div>
                          <div className="w-full bg-purple-200 rounded-full h-2 mb-4">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${((currentGroundingStep + 1) / selectedTechnique.instructions!.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-center gap-4">
                          <Button
                            onClick={nextGroundingStep}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full"
                          >
                            {currentGroundingStep === selectedTechnique.instructions!.length - 1 ? 'Complete' : 'Next Step'}
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
            </>
          ) : selectedTechnique.isEnhanced ? (
            // Enhanced Surya Namaskar Layout
            <>
              {/* Visual Guide with GIF */}
              <Card className="mb-8 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Sun className="h-8 w-8 text-white animate-pulse" />
                      <h3 className="text-2xl font-bold text-white">Visual Guide</h3>
                      <Sparkles className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    <p className="text-orange-100">Follow along with this traditional sequence</p>
                  </div>
                  <div className="p-6">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white">
                      <img
                        src="https://blog.cosmicinsights.net/wp-content/uploads/2020/02/sun-sal.gif"
                        alt="Surya Namaskar Visual Guide"
                        className="w-full h-64 md:h-80 object-contain bg-gradient-to-br from-orange-50 to-yellow-50"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex items-center justify-center h-64 md:h-80 bg-gradient-to-br from-orange-100 to-yellow-100 text-orange-600">
                                <div class="text-center">
                                  <div class="text-6xl mb-4">🌅</div>
                                  <p class="text-lg font-semibold">Visual Guide</p>
                                  <p class="text-sm">Follow the steps below</p>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full text-orange-800 font-medium">
                        <Button 
                  onClick={startSuryaNamaskar}
                  className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 hover:from-orange-600 hover:via-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Sun className="h-6 w-6 mr-3 animate-pulse" />
                  Begin Surya Namaskar
                </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ,
              {/* Step-by-Step Instructions */}
              <Card className="mb-8 bg-white/90 backdrop-blur-sm border border-orange-200 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
                    <Brain className="h-6 w-6 text-orange-500" />
                    12 Sacred Poses of Surya Namaskar
                  </h3>
                  
                  {suryaPhase === 'active' && (
                    <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 border-2 border-orange-300 mb-6">
                      <div className="text-center mb-4">
                        <div className="text-lg font-semibold text-orange-800 mb-2">
                          Current Pose: {currentSuryaStep + 1} of {selectedTechnique.instructions!.length}
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-3 mb-4">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${((currentSuryaStep + 1) / selectedTechnique.instructions!.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-white/80 p-6 rounded-xl border border-orange-200">
                        <div className="font-bold text-xl text-orange-800 mb-2">
                          {selectedTechnique.instructions![currentSuryaStep].split(' - ')[0]}
                        </div>
                        <div className="text-slate-700 text-lg">
                          {selectedTechnique.instructions![currentSuryaStep].split(' - ')[1] || selectedTechnique.instructions![currentSuryaStep]}
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <Button
                          onClick={resetSuryaNamaskar}
                          variant="outline"
                          className="px-6 py-2 rounded-full border-2 border-orange-300"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Stop Practice
                        </Button>
                      </div>
                    </div>
                  )}

                  {suryaPhase === 'complete' && (
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 border border-emerald-200 mb-6">
                      <div className="text-center">
                        <div className="text-4xl mb-3">🙏</div>
                        <h4 className="text-xl font-bold text-emerald-800 mb-2">Surya Namaskar Complete!</h4>
                        <p className="text-emerald-700 mb-4">
                          You have honored the sun and completed one full round. Feel the energy flowing through your body.
                        </p>
                        <Button
                          onClick={resetSuryaNamaskar}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-full"
                        >
                          Practice Another Round
                        </Button>
                      </div>
                    </div>
                  )}

                  {suryaPhase === 'ready' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {selectedTechnique.instructions?.map((instruction, index) => (
                        <div key={index} className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 hover:shadow-md transition-all duration-200">
                          <div className="flex-shrink-0">
                            <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-orange-800 mb-1">
                              {instruction.split(' - ')[0]}
                            </div>
                            <div className="text-slate-700 text-sm leading-relaxed">
                              {instruction.split(' - ')[1] || instruction}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              
              <div className="text-center">
                
                <p className="text-slate-600 mt-4 max-w-md mx-auto">
                  Honor the sun within you and feel the energy flow through each graceful movement
                </p>
              </div>
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