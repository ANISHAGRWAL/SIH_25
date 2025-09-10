"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, Brain, ArrowLeft, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// Define the type for the Yoga Pose object
interface YogaPose {
  id: number;
  name: string;
  duration: string;
  difficulty: string;
  benefits: string;
  instructions: string[];
  color: string;
}

// Define the type for the component's props
interface YogaPoseClientProps {
  pose: YogaPose;
}

// Fix 1: Type the 'pose' prop using the interface
export default function YogaPoseClient({ pose }: YogaPoseClientProps) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("completedYogaPoses")
    if (saved) {
      const completedPoses = JSON.parse(saved)
      setIsCompleted(completedPoses.includes(pose.id))
    }
  }, [pose.id])

  const handleFinished = () => {
    const saved = localStorage.getItem("completedYogaPoses")
    const completedPoses = saved ? JSON.parse(saved) : []

    if (!completedPoses.includes(pose.id)) {
      completedPoses.push(pose.id)
      localStorage.setItem("completedYogaPoses", JSON.stringify(completedPoses))
    }

    router.push("/wellness/yoga")
  }

  // Fix 2: Type the 'difficulty' parameter
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/wellness/yoga")}
          className="mb-6 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Yoga Poses
        </Button>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧘</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{pose.name}</h1>
          <div className="flex items-center justify-center gap-4 text-slate-600 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{pose.duration}</span>
            </div>
            <Badge className={getDifficultyColor(pose.difficulty)}>{pose.difficulty}</Badge>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>Yoga</span>
            </div>
          </div>
          <p className="text-slate-600 mb-6">{pose.benefits}</p>
          {isCompleted && (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Already completed!</span>
            </div>
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Step-by-Step Instructions
            </h3>
            <ol className="space-y-3">
              {/* Fixes 3 & 4: Type the 'instruction' and 'index' parameters */}
              {pose.instructions.map((instruction: string, index: number) => (
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

        <div className="text-center space-y-4">
          <Button
            onClick={handleFinished}
            className="bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-8 py-3 rounded-full text-lg"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Mark as Finished
          </Button>
          <p className="text-slate-600">
            Take your time and listen to your body. Click "Mark as Finished" when you complete the pose.
          </p>
        </div>
      </div>
    </div>
  )
}