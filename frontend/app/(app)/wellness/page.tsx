"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

const techniques = [
  {
    id: 1,
    name: "4-7-8 Breathing",
    duration: "3 minutes",
    emoji: "🌬️",
    benefits: "Reduces anxiety and promotes sleep",
    color: "from-blue-100 to-indigo-100",
    route: "/wellness/4-7-8-breathing",
  },
  {
    id: 2,
    name: "Yoga",
    duration: "5-15 minutes",
    emoji: "🧘",
    benefits: "Improves flexibility, strength, and mental clarity",
    color: "from-green-100 to-emerald-100",
    route: "/wellness/yoga",
  },
  {
    id: 3,
    name: "Surya Namaskar",
    duration: "8 minutes",
    emoji: "🌅",
    benefits: "Energizes body, improves focus, and connects with solar energy",
    color: "from-orange-100 to-yellow-100",
    route: "/wellness/surya-namaskar",
  },
  {
    id: 4,
    name: "5-4-3-2-1 Grounding",
    duration: "3-5 minutes",
    emoji: "🧭",
    benefits: "Reduces anxiety, improves focus, and grounds you in the present moment",
    color: "from-purple-100 to-pink-100",
    route: "/wellness/5-4-3-2-1-grounding",
  },
  {
    id: 6,
    name: "Mindful Body Scan",
    duration: "7 minutes",
    emoji: "🔍",
    benefits: "Increases body awareness and relaxation",
    color: "from-slate-100 to-gray-100",
    route: "/wellness/mindful-body-scan",
  },
]

export default function WellnessPage() {
  const router = useRouter()

  const startTechnique = (technique: (typeof techniques)[0]) => {
    router.push(technique.route)
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