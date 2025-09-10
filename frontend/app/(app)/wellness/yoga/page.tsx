"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const yogaPoses = [
  {
    id: 1,
    name: "Child's Pose",
    duration: "5 minutes",
    difficulty: "Beginner",
    benefits: "Relieves stress and calms the mind",
    instructions: [
      "Kneel on the floor. Touch your big toes together and sit on your heels, then separate your knees about as wide as your hips",
      "Exhale and fold forward; lay your torso down between your thighs. Narrow your hip points toward the navel",
      "Broaden across the back of your pelvis at the sacrum and lengthen your tailbone away from the back",
      "Tuck your chin slightly to lift the base of your skull away from the back of your neck",
      "Walk your hands out toward the front for Extended Child's pose, or reach back toward your feet with arms alongside your torso",
      "Allow the weight of the shoulders to pull the shoulder blades wide across your back",
      "Stay anywhere from 30 seconds to a few minutes, breathing deeply",
      "To come up, first lengthen the front torso, then lift from the tailbone as it presses down into the pelvis",
    ],
    color: "from-green-100 to-emerald-100",
  },
  {
    id: 2,
    name: "Mountain Pose",
    duration: "3 minutes",
    difficulty: "Beginner",
    benefits: "Improves posture and builds foundation",
    instructions: [
      "Stand with feet hip-width apart, parallel to each other",
      "Ground down through all four corners of your feet",
      "Engage your leg muscles and lift your kneecaps",
      "Lengthen your tailbone toward the floor",
      "Draw your shoulder blades down your back",
      "Reach the crown of your head toward the ceiling",
      "Breathe deeply and hold for 30 seconds to 1 minute",
    ],
    color: "from-blue-100 to-sky-100",
  },
  {
    id: 3,
    name: "Downward Dog",
    duration: "4 minutes",
    difficulty: "Intermediate",
    benefits: "Strengthens arms and legs, stretches spine",
    instructions: [
      "Start on hands and knees in tabletop position",
      "Tuck your toes under and lift your hips up and back",
      "Straighten your legs as much as possible",
      "Press firmly through your hands",
      "Create an inverted V-shape with your body",
      "Hold for 30 seconds to 1 minute, breathing deeply",
    ],
    color: "from-orange-100 to-amber-100",
  },
  {
    id: 4,
    name: "Warrior I",
    duration: "6 minutes",
    difficulty: "Intermediate",
    benefits: "Builds strength and improves balance",
    instructions: [
      "Step your left foot back about 3-4 feet",
      "Turn your left foot out 45 degrees",
      "Bend your right knee over your ankle",
      "Square your hips toward the front",
      "Raise your arms overhead",
      "Hold for 30 seconds, then switch sides",
    ],
    color: "from-purple-100 to-violet-100",
  },
  {
    id: 5,
    name: "Cat-Cow Stretch",
    duration: "4 minutes",
    difficulty: "Beginner",
    benefits: "Increases spine flexibility and relieves tension",
    instructions: [
      "Start in tabletop position on hands and knees",
      "Inhale, arch your back and look up (Cow pose)",
      "Exhale, round your spine and tuck your chin (Cat pose)",
      "Move slowly between the two positions",
      "Coordinate movement with your breath",
      "Repeat 5-10 times",
    ],
    color: "from-pink-100 to-rose-100",
  },
  {
    id: 6,
    name: "Tree Pose",
    duration: "5 minutes",
    difficulty: "Intermediate",
    benefits: "Improves balance and concentration",
    instructions: [
      "Stand in Mountain Pose",
      "Shift weight to your left foot",
      "Place right foot on inner left thigh or calf (not knee)",
      "Press foot into leg and leg into foot",
      "Bring hands to prayer position at chest",
      "Hold for 30 seconds, then switch sides",
    ],
    color: "from-teal-100 to-cyan-100",
  },
]

export default function YogaPage() {
  const [completedPoses, setCompletedPoses] = useState<number[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load completed poses from localStorage
    const saved = localStorage.getItem("completedYogaPoses")
    if (saved) {
      setCompletedPoses(JSON.parse(saved))
    }
  }, [])

  const handlePoseClick = (poseId: number) => {
    router.push(`/wellness/yoga/${poseId}`)
  }

  const getDifficultyColor = (difficulty: string) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wellness
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">🧘 Yoga Poses</h1>
          <p className="text-xl text-slate-600 mb-2">Find your inner peace through movement</p>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Explore these carefully selected yoga poses designed to help you build strength, flexibility, and
            mindfulness.
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-slate-700 font-medium">
              {completedPoses.length} of {yogaPoses.length} poses completed
            </span>
          </div>
        </div>

        {/* Yoga Poses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yogaPoses.map((pose) => {
            const isCompleted = completedPoses.includes(pose.id)
            return (
              <Card
                key={pose.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br ${pose.color} border-0 relative ${
                  isCompleted ? "ring-2 ring-green-400" : ""
                }`}
                onClick={() => handlePoseClick(pose.id)}
              >
                {isCompleted && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-slate-800">{pose.name}</h3>
                    <Badge className={getDifficultyColor(pose.difficulty)}>{pose.difficulty}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 mb-3">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{pose.duration}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{pose.benefits}</p>
                  <Button
                    size="sm"
                    className={`w-full rounded-full ${
                      isCompleted
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-white/80 hover:bg-white text-slate-700"
                    }`}
                  >
                    {isCompleted ? "Completed ✓" : "Start Practice"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">Ready to Start Your Yoga Journey?</h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            Begin with beginner poses and gradually work your way up. Remember, yoga is about progress, not perfection.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-6 py-2 rounded-full"
              onClick={() => handlePoseClick(1)}
            >
              Start with Child's Pose
            </Button>
            <Button variant="outline" className="px-6 py-2 rounded-full bg-transparent" onClick={() => router.back()}>
              Back to Wellness
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
