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
    <div className="max-w-6xl mx-auto py-2">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Yoga &amp; Meditation</h1>
        <p className="text-slate-500 text-sm">Your 5-minute mental detox — quick techniques for busy students</p>
      </div>

      <div className="mb-10">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Quick Wellness Techniques</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {techniques.map((technique) => (
            <Card
              key={technique.id}
              className={`mc-card mc-lift cursor-pointer bg-gradient-to-br ${technique.color} border-0`}
              onClick={() => startTechnique(technique)}
            >
              <CardContent className="p-5 text-center">
                <div className="text-4xl mb-3">{technique.emoji}</div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">{technique.name}</h3>
                <div className="flex items-center justify-center gap-1 text-slate-500 mb-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs">{technique.duration}</span>
                </div>
                <p className="text-slate-600 text-xs mb-4 leading-relaxed">{technique.benefits}</p>
                <Button size="sm" className="bg-white/90 hover:bg-white text-slate-700 rounded-full border border-white/60 shadow-sm hover:shadow transition-all duration-200 text-xs">
                  <Play className="h-3 w-3 mr-1" />
                  Try Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>

        {/* Call to Action */}
      <div className="mc-card p-6 text-center mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Ready to Begin Your Wellness Journey?</h2>
        <p className="text-slate-500 text-sm mb-5 max-w-lg mx-auto">
          Begin your journey to inner calm and clarity. All you need is a few minutes and a quiet space.
        </p>
        <Button
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => startTechnique(techniques[0])}
        >
          <Play className="h-4 w-4 mr-2" />
          Start Now
        </Button>
      </div>
    </div>
  )
}