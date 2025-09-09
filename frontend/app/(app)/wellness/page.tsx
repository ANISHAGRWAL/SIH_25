"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Clock, Heart, Brain } from "lucide-react"

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
    name: "Child's Pose",
    duration: "5 minutes",
    emoji: "🧘",
    benefits: "Relieves stress and calms the mind",
    instructions: [
      "Kneel on the floor with big toes touching",
      "Sit back on your heels",
      "Separate knees hip-width apart",
      "Fold forward, extending arms in front",
      "Rest forehead on the ground",
      "Breathe deeply and hold",
    ],
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
  {
    id: 5,
    name: "Legs Up the Wall",
    duration: "10 minutes",
    emoji: "🦵",
    benefits: "Reduces fatigue and calms nervous system",
    instructions: [
      "Lie on your back near a wall",
      "Extend legs up against the wall",
      "Arms relaxed at your sides",
      "Close your eyes and breathe naturally",
      "Focus on releasing tension",
      "Stay for 5-15 minutes",
    ],
    color: "from-teal-100 to-cyan-100",
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
    color: "from-lavender-100 to-violet-100",
  },
]

export default function WellnessPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTechnique, setSelectedTechnique] = useState<(typeof techniques)[0] | null>(null)

  const nextTechnique = () => {
    setCurrentIndex((prev) => (prev + 1) % techniques.length)
  }

  const prevTechnique = () => {
    setCurrentIndex((prev) => (prev - 1 + techniques.length) % techniques.length)
  }

  const startTechnique = (technique: (typeof techniques)[0]) => {
    setSelectedTechnique(technique)
  }

  if (selectedTechnique) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedTechnique(null)}
            className="mb-6 text-slate-600 hover:text-slate-900"
          >
            ← Back to Techniques
          </Button>

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

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Step-by-Step Instructions
              </h3>
              <ol className="space-y-3">
                {selectedTechnique.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-teal-400 to-sky-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-slate-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button className="bg-gradient-to-r from-teal-400 to-sky-600 hover:from-teal-500 hover:to-sky-700 text-white px-8 py-3 rounded-full text-lg">
              <Play className="h-5 w-5 mr-2" />
              Begin Practice
            </Button>
            <p className="text-slate-600 mt-3">Take your time and listen to your body</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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

        {/* Techniques Carousel */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-800">Quick Wellness Techniques</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={prevTechnique} className="rounded-full bg-transparent">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextTechnique} className="rounded-full bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techniques.slice(currentIndex, currentIndex + 3).map((technique) => (
              <Card
                key={technique.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br ${technique.color} border-0`}
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
                  <Button size="sm" className="bg-white/80 hover:bg-white text-slate-700 rounded-full">
                    Try Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">Ready to Begin Your Wellness Journey?</h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            Begin your journey to inner calm and clarity. All you need is a few minutes and a quiet space.
          </p>
          <Button
            className="bg-gradient-to-r from-teal-400 to-sky-600 hover:from-teal-500 hover:to-sky-700 text-white px-8 py-3 rounded-full text-lg"
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
