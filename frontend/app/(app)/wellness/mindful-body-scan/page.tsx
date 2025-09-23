"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Heart, Brain } from "lucide-react"

export default function BodyScanPage() {
  const technique = {
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
  }

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

        <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <Brain className="h-5 w-5" />
              Step-by-Step Instructions
            </h3>
            <ol className="space-y-3">
              {technique.instructions?.map((instruction, index) => (
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
      </div>
    </div>
  )
}