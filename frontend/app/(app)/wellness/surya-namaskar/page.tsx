"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Heart, Brain, RotateCcw, Sun, Sparkles } from "lucide-react"

export default function SuryaNamaskarPage() {
  // State variables for Surya Namaskar
  const [isSuryaActive, setIsSuryaActive] = useState(false)
  const [currentSuryaStep, setCurrentSuryaStep] = useState(0)
  const [suryaPhase, setSuryaPhase] = useState('ready') // 'ready', 'active', 'complete'

  const technique = {
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
  }

  // Surya Namaskar logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isSuryaActive) {
      timer = setInterval(() => {
        setCurrentSuryaStep(step => {
          const nextStep = step + 1;
          if (nextStep >= technique.instructions.length) {
            setIsSuryaActive(false);
            setSuryaPhase('complete');
            return step;
          }
          return nextStep;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isSuryaActive, technique.instructions]);

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
                    Current Pose: {currentSuryaStep + 1} of {technique.instructions.length}
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${((currentSuryaStep + 1) / technique.instructions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white/80 p-6 rounded-xl border border-orange-200">
                  <div className="font-bold text-xl text-orange-800 mb-2">
                    {technique.instructions[currentSuryaStep].split(' - ')[0]}
                  </div>
                  <div className="text-slate-700 text-lg">
                    {technique.instructions[currentSuryaStep].split(' - ')[1] || technique.instructions[currentSuryaStep]}
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
                {technique.instructions?.map((instruction, index) => (
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
      </div>
    </div>
  )
}