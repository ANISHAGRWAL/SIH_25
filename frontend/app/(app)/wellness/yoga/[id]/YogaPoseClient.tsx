"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, Brain, ArrowLeft, ArrowRight, CheckCircle, Target } from "lucide-react"
import { useRouter } from "next/navigation"

// Define the type for the Yoga Pose object
interface YogaPose {
  id: number;
  name: string;
  sanskritName: string;
  duration: string;
  difficulty: string;
  benefits: string;
  bestFor: string;
  instructions: string[];
  color: string;
}

// Define the type for the component's props
interface YogaPoseClientProps {
  pose: YogaPose;
}

// Yoga pose images mapping for the new poses
const yogaPoseImages: { [key: number]: string } = {
  1: "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2021/08/2265-Childs_Pose-400x400-exercise.gif",
  2: "https://media.post.rvohealth.io/wp-content/uploads/2020/11/Legs-Up-the-Wall-Pose.gif",
  3: "https://media.post.rvohealth.io/wp-content/uploads/2023/08/Cat-cow-pose.gif",
  4: "https://www.verywellfit.com/thmb/5HkUB_FNPmY42myC0JRiJ_kYvHI=/1500x1000/filters:no_upscale():max_bytes(150000):strip_icc()/Verywell-03-3567193-ForwardBend01-110-598b6652af5d3a0011ccd349.gif",
  5: "https://images.squarespace-cdn.com/content/v1/5d31ed671abe780001b2964d/1629138771884-ML3UZ97NYL33IQ3HJA7L/image-asset.jpeg",
  6: "https://media.post.rvohealth.io/wp-content/uploads/2017/10/Bridge-Pose.gif",
  7: "https://th.bing.com/th/id/R.27e81c20cdca70d3172f66f49f902ea2?rik=milmQHP5tEWEbA&riu=http%3a%2f%2fwww.yogajournal.com%2fwp-content%2fuploads%2fsites%2f17%2f2016%2f02%2fseatedforwardbend-march.gif&ehk=WQupc8uKnCZZj%2fGBUeVkbp8BEpop3ZeDPiTjlUq52rc%3d&risl=&pid=ImgRaw&r=0",
  8: "https://www.verywellfit.com/thmb/SIcWqZ39XEfDLCiEvSjaklzCGrg=/900x0/filters:no_upscale():max_bytes(150000):strip_icc()/forward-fold-5989fe260d327a00115d1905.gif",
  9: "https://www.verywellfit.com/thmb/7OThD-TI7MafbeVWy4YzoFvZ638=/1500x1000/filters:fill(FFDB5D,1)/Verywell-20-4023748-SpinalTwist01-1729-5995b536845b340010c016cf.gif",
  10: "https://post.healthline.com/wp-content/uploads/2022/11/400x400_Breathing_Techniques_For_Stress_Relief_and_More_Alternate_Nostril_Breathing.gif",
}

export default function YogaPoseClient({ pose }: YogaPoseClientProps) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(false)

  const allYogaPoseIds = Object.keys(yogaPoseImages).map(Number).sort((a, b) => a - b);
  const currentPoseIndex = allYogaPoseIds.indexOf(pose.id);
  const nextPoseId = allYogaPoseIds[currentPoseIndex + 1];
  const isLastPose = currentPoseIndex === allYogaPoseIds.length - 1;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("completedYogaPoses")
      if (saved) {
        const completedPoses = JSON.parse(saved)
        setIsCompleted(completedPoses.includes(pose.id))
      }
    } catch (e) {
      console.error("Failed to access localStorage", e);
    }
  }, [pose.id])

  const handleFinished = () => {
    try {
      const saved = localStorage.getItem("completedYogaPoses")
      const completedPoses = saved ? JSON.parse(saved) : []

      if (!completedPoses.includes(pose.id)) {
        completedPoses.push(pose.id)
        localStorage.setItem("completedYogaPoses", JSON.stringify(completedPoses))
        setIsCompleted(true)
      }

      setTimeout(() => {
        if (isLastPose) {
          router.push("/wellness/yoga")
        } else {
          router.push(`/wellness/yoga/${nextPoseId}`)
        }
      }, 1500)
    } catch (e) {
      console.error("Failed to update localStorage", e);
      if (isLastPose) {
        router.push("/wellness/yoga")
      } else {
        router.push(`/wellness/yoga/${nextPoseId}`)
      }
    }
  }

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-50 text-green-700 border-green-200"
      case "Intermediate":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Advanced":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const isBreathingPractice = pose.id === 10

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto p-4 md:p-8">

        {/* Back Button - Top of Content on Mobile */}
        <div className="mb-4 md:hidden">
          <Button
            variant="ghost"
            onClick={() => router.push("/wellness/yoga")}
            className="text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Floating Back Button for Desktop */}
        <div className="hidden md:block fixed top-8 left-8 z-50">
          <Button
            variant="outline"
            onClick={() => router.push("/wellness/yoga")}
            className="text-slate-600 hover:text-slate-800 border-slate-300 bg-white hover:bg-gray-50 shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Yoga Poses
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 mt-4 md:mt-0">
          <div className="text-5xl mb-2">{isBreathingPractice ? '🌬️' : '🧘'}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">{pose.name}</h1>
          <p className="text-md text-slate-500 italic mb-4">{pose.sanskritName}</p>
          
          <div className="flex items-center justify-center gap-3 text-slate-600 flex-wrap text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{pose.duration}</span>
            </div>
            <Badge variant="outline" className={`${getDifficultyColor(pose.difficulty)} border font-medium px-2 py-0.5`}>
              {pose.difficulty}
            </Badge>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-rose-500" />
              <span className="font-medium">{isBreathingPractice ? 'Pranayama' : 'Yoga'}</span>
            </div>
          </div>

          {isCompleted && (
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full mt-4 border border-green-200 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
            </div>
          )}
        </div>

        {/* Image Section (Updated for YouTube-like size and no background) */}
        <div className="relative mb-6 md:mb-8 w-full aspect-video rounded-lg overflow-hidden shadow-lg">
          <img
            src={yogaPoseImages[pose.id]}
            alt={`${pose.name} (${pose.sanskritName}) demonstration`}
            className="w-full h-full object-cover"
          />
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Dynamic Benefits & Best For Section */}
        {/* Shows as a single combined card on mobile, and a two-column grid on desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Benefits</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{pose.benefits}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Best For</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{pose.bestFor}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Single unified card for mobile view */}
        <div className="md:hidden">
          <Card className="bg-white border-slate-200 shadow-lg mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Benefits</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{pose.benefits}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Best For</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{pose.bestFor}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Instructions Section */}
        <Card className="mb-8 bg-white border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                {isBreathingPractice ? 'Breathing Technique' : 'Instructions'}
              </h2>
            </div>
            
            <ol className="space-y-4">
              {pose.instructions.map((instruction: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed text-sm pt-0.5">{instruction}</p>
                </li>
              ))}
            </ol>
            
            {isBreathingPractice && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm leading-relaxed">
                  <strong>Note:</strong> This is a breathing technique (pranayama), not a physical pose. 
                  Find a comfortable seated position and focus on your breath pattern.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Section */}
        <div className="flex justify-center w-full">
          <Button
            onClick={handleFinished}
            size="lg"
            className="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isLastPose ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Finish Session
              </>
            ) : (
              <>
                <ArrowRight className="h-5 w-5 mr-2" />
                Next Pose
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}