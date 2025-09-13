"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, Brain, ArrowLeft, CheckCircle, Target } from "lucide-react"
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
  const [imageLoaded, setImageLoaded] = useState(false)

  // Use an effect to check local storage when the component loads
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

  // Function to handle the "Mark as Finished" button click
  const handleFinished = () => {
    try {
      const saved = localStorage.getItem("completedYogaPoses")
      const completedPoses = saved ? JSON.parse(saved) : []

      // Only update local storage if the pose hasn't been completed yet
      if (!completedPoses.includes(pose.id)) {
        completedPoses.push(pose.id)
        localStorage.setItem("completedYogaPoses", JSON.stringify(completedPoses))
        // Update the state immediately to show the "completed" message
        setIsCompleted(true)
      }

      // After updating the UI, redirect the user after a brief delay
      setTimeout(() => {
        router.push("/wellness/yoga")
      }, 1500) // 1.5-second delay to show the completed state
    } catch (e) {
      console.error("Failed to update localStorage", e);
      // Fallback to immediate redirection if localStorage fails
      router.push("/wellness/yoga")
    }
  }

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border border-green-200"
      case "Intermediate":
        return "bg-amber-100 text-amber-800 border border-amber-200"
      case "Advanced":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-slate-100 text-slate-800 border border-slate-200"
    }
  }

  // Special handling for breathing practice (not a physical pose)
  const isBreathingPractice = pose.id === 10

  return (
    <div className="min-h-screen bg-blue-50 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/wellness/yoga")}
          className="mb-6 text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Yoga Poses
        </Button>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Image Section */}
          <div className="order-2 md:order-1">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl overflow-hidden">
              <div className="relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse flex items-center justify-center min-h-[300px]">
                    <div className="text-4xl md:text-6xl opacity-50">
                      {isBreathingPractice ? '🌬️' : '🧘'}
                    </div>
                  </div>
                )}
                <img
                  src={yogaPoseImages[pose.id]}
                  alt={`${pose.name} (${pose.sanskritName}) demonstration`}
                  className={`w-full h-auto object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(false)}
                />
                {isCompleted && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2 shadow-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Content Section */}
          <div className="order-1 md:order-2 flex flex-col justify-center">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl p-6 md:p-8">
              <div className="text-center md:text-left">
                <div className="text-3xl mb-4">{isBreathingPractice ? '🌬️' : '🧘'}</div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">{pose.name}</h1>
                <p className="text-base md:text-lg text-slate-500 italic mb-4">{pose.sanskritName}</p>
                
                <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 text-slate-600 mb-6 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{pose.duration}</span>
                  </div>
                  <Badge className={getDifficultyColor(pose.difficulty)}>{pose.difficulty}</Badge>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{isBreathingPractice ? 'Pranayama' : 'Yoga'}</span>
                  </div>
                </div>
                
                {/* Benefits Section */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-2">
                    <Heart className="h-4 w-4 text-rose-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-700 mb-1 text-sm">How it helps:</h3>
                      <p className="text-slate-600 text-sm">{pose.benefits}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-700 mb-1 text-sm">Best for:</h3>
                      <p className="text-slate-600 text-sm">{pose.bestFor}</p>
                    </div>
                  </div>
                </div>
                
                {isCompleted && (
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-xl mb-4 border border-green-200">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium text-sm">Already completed!</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
              <Brain className="h-5 md:h-6 w-5 md:w-6" />
              {isBreathingPractice ? 'Step-by-Step Breathing Technique' : 'Step-by-Step Instructions'}
            </h3>
            <ol className="space-y-4">
              {pose.instructions.map((instruction: string, index: number) => (
                <li key={index} className="flex gap-3 md:gap-4">
                  <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-indigo-400 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                  </span>
                  <span className="text-slate-700 text-sm md:text-base leading-relaxed pt-1">{instruction}</span>
                </li>
              ))}
            </ol>
            
            {isBreathingPractice && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This is a breathing technique (pranayama), not a physical pose. 
                  Find a comfortable seated position and focus on your breath pattern.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
          <CardContent className="p-6 md:p-8 text-center space-y-4">
            <Button
              onClick={handleFinished}
              className="bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white px-8 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Mark as Finished
            </Button>
            <p className="text-slate-600 max-w-md mx-auto text-sm">
              Take your time and listen to your body. Click "Mark as Finished" when you complete the {isBreathingPractice ? 'breathing practice' : 'pose'}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}