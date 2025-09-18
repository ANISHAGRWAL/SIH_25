"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, ArrowLeft, Brain, Heart, RotateCcw, Trash2, Star, PlayCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const yogaPoses = [
  {
    id: 1,
    name: "Child's Pose",
    sanskritName: "Balasana",
    duration: "3-5 minutes",
    difficulty: "Beginner",
    benefits: "Calms the brain, relieves stress and fatigue, and gently stretches the back",
    bestFor: "Grounding and mental rest during overwhelm",
    instructions: [
      "Kneel on the floor with your big toes touching and knees about hip-width apart",
      "Sit back on your heels and slowly fold forward, bringing your forehead to the ground",
      "Extend your arms forward or rest them alongside your body with palms facing up",
      "Allow your shoulders to relax and sink toward the ground",
      "Breathe deeply and hold the pose, focusing on releasing tension",
      "Stay for 30 seconds to several minutes as needed",
      "To come out, slowly lift your torso and return to kneeling position"
    ],
    color: "bg-gradient-to-br from-emerald-50 to-teal-100",
    borderColor: "border-emerald-200",
    icon: "🧘‍♀️"
  },
  {
    id: 2,
    name: "Legs-Up-the-Wall Pose",
    sanskritName: "Viparita Karani",
    duration: "5-15 minutes",
    difficulty: "Beginner",
    benefits: "Regulates blood flow, calms the nervous system, and helps with anxiety and insomnia",
    bestFor: "Post-study or post-screen-time relaxation",
    instructions: [
      "Lie on your back near a wall, with your sitting bones close to the wall base",
      "Extend your legs up the wall, keeping them straight but relaxed",
      "Rest your arms by your sides with palms facing up",
      "Close your eyes and focus on your breath",
      "Allow gravity to help drain tension from your legs",
      "Stay for 5-15 minutes, breathing naturally",
      "To come out, bend your knees and roll to one side before sitting up slowly"
    ],
    color: "bg-gradient-to-br from-sky-50 to-blue-100",
    borderColor: "border-sky-200",
    icon: "🌊"
  },
  {
    id: 3,
    name: "Cat-Cow Pose",
    sanskritName: "Marjaryasana-Bitilasana",
    duration: "2-3 minutes",
    difficulty: "Beginner",
    benefits: "Increases flexibility, reduces tension in spine and shoulders, and synchronizes breath",
    bestFor: "Starting your day or releasing tension after long sitting",
    instructions: [
      "Start in tabletop position with hands under shoulders and knees under hips",
      "Inhale, arch your back, lift your chest and tailbone (Cow pose)",
      "Exhale, round your spine, tuck your chin to chest (Cat pose)",
      "Move slowly between poses, coordinating with your breath",
      "Inhale into Cow, exhale into Cat",
      "Repeat 5-10 rounds, focusing on spinal mobility",
      "Return to neutral tabletop position to finish"
    ],
    color: "bg-gradient-to-br from-violet-50 to-purple-100",
    borderColor: "border-violet-200",
    icon: "🐱"
  },
  {
    id: 4,
    name: "Standing Forward Bend",
    sanskritName: "Uttanasana",
    duration: "1-3 minutes",
    difficulty: "Beginner",
    benefits: "Calms the brain, reduces anxiety and mild depression, and relieves stress",
    bestFor: "Quick breaks during study sessions",
    instructions: [
      "Stand with feet hip-width apart, hands on your hips",
      "Exhale and hinge forward from your hips, not your waist",
      "Let your arms hang down or hold opposite elbows",
      "Keep a slight bend in your knees to protect your hamstrings",
      "Let your head hang heavy, releasing neck tension",
      "Breathe deeply and sway gently if it feels good",
      "To come up, place hands on hips and slowly roll up vertebra by vertebra"
    ],
    color: "bg-gradient-to-br from-amber-50 to-orange-100",
    borderColor: "border-amber-200",
    icon: "🌅"
  },
  {
    id: 5,
    name: "Corpse Pose",
    sanskritName: "Savasana",
    duration: "5-20 minutes",
    difficulty: "Beginner",
    benefits: "Deep relaxation, mindfulness, and full-body release",
    bestFor: "Ending your yoga session or before sleeping",
    instructions: [
      "Lie on your back with legs slightly apart and arms by your sides",
      "Turn palms up and let your feet fall open naturally",
      "Close your eyes and take a few deep breaths",
      "Starting from your toes, consciously relax each part of your body",
      "Let go of any effort to control your breath",
      "If your mind wanders, gently return attention to your body",
      "Rest in complete stillness for 5-20 minutes",
      "To come out, wiggle fingers and toes, then slowly roll to one side"
    ],
    color: "bg-gradient-to-br from-indigo-50 to-slate-100",
    borderColor: "border-indigo-200",
    icon: "💤"
  },
  {
    id: 6,
    name: "Bridge Pose",
    sanskritName: "Setu Bandhasana",
    duration: "3-5 minutes",
    difficulty: "Intermediate",
    benefits: "Stimulates the brain, reduces anxiety, and stretches chest, neck, and spine",
    bestFor: "Energizing yourself during stressful periods",
    instructions: [
      "Lie on your back with knees bent and feet flat on the floor, hip-width apart",
      "Place arms alongside your body with palms down",
      "Exhale and press your feet into the floor to lift your hips",
      "Keep your knees parallel and engage your glutes",
      "Interlace your fingers under your back if comfortable",
      "Keep your neck neutral and breathe steadily",
      "Hold for 30 seconds to 1 minute",
      "Slowly lower down vertebra by vertebra"
    ],
    color: "bg-gradient-to-br from-teal-50 to-cyan-100",
    borderColor: "border-teal-200",
    icon: "🌉"
  },
  {
    id: 7,
    name: "Seated Forward Bend",
    sanskritName: "Paschimottanasana",
    duration: "3-5 minutes",
    difficulty: "Intermediate",
    benefits: "Calms the brain, relieves stress, and gently stretches the spine and hamstrings",
    bestFor: "End-of-day relaxation or during anxiety flare-ups",
    instructions: [
      "Sit with legs extended straight in front of you",
      "Sit up tall, lengthening through your spine",
      "Inhale and reach your arms overhead",
      "Exhale and hinge forward from your hips, not your waist",
      "Reach for your feet, shins, or thighs - wherever feels comfortable",
      "Keep your spine long rather than rounding your back",
      "Breathe deeply and hold, releasing deeper with each exhale",
      "Slowly roll up to seated position"
    ],
    color: "bg-gradient-to-br from-rose-50 to-pink-100",
    borderColor: "border-rose-200",
    icon: "🌸"
  },
  {
    id: 8,
    name: "Easy Pose with Forward Fold",
    sanskritName: "Sukhasana + Forward Bend",
    duration: "3-5 minutes",
    difficulty: "Beginner",
    benefits: "Calms the mind, stretches the lower back, and promotes inward focus",
    bestFor: "Meditation and breath control practice",
    instructions: [
      "Sit cross-legged in a comfortable position (Easy Pose)",
      "Place a cushion or blanket under your hips if needed",
      "Sit tall and take a few deep breaths",
      "Place hands on the floor in front of you",
      "Slowly walk your hands forward, folding over your legs",
      "Rest your forehead on the ground, a block, or your hands",
      "Breathe deeply and surrender into the pose",
      "Slowly walk your hands back and return to seated"
    ],
    color: "bg-gradient-to-br from-green-50 to-emerald-100",
    borderColor: "border-green-200",
    icon: "🍃"
  },
  {
    id: 9,
    name: "Supine Spinal Twist",
    sanskritName: "Supta Matsyendrasana",
    duration: "3-5 minutes each side",
    difficulty: "Beginner",
    benefits: "Relieves tension, reduces fatigue and stress, and detoxifies internal organs",
    bestFor: "Before bed or after emotional overload",
    instructions: [
      "Lie on your back with arms extended out to the sides in a T-shape",
      "Draw your right knee into your chest",
      "Cross your right knee over to the left side of your body",
      "Keep your right shoulder grounded and look to the right",
      "Use your left hand to gently encourage the twist if needed",
      "Breathe deeply and hold for 1-3 minutes",
      "Return to center and repeat on the other side",
      "Hug both knees to chest when finished"
    ],
    color: "bg-gradient-to-br from-yellow-50 to-amber-100",
    borderColor: "border-yellow-200",
    icon: "🌀"
  },
  {
    id: 10,
    name: "Alternate Nostril Breathing",
    sanskritName: "Nadi Shodhana Pranayama",
    duration: "5-10 minutes",
    difficulty: "Beginner",
    benefits: "Balances nervous system, lowers heart rate, reduces anxiety",
    bestFor: "Beginning or ending your yoga practice, or calming exam stress",
    instructions: [
      "Sit comfortably with your spine straight",
      "Use your right thumb to close your right nostril",
      "Inhale slowly through your left nostril for 4 counts",
      "Use your ring finger to close your left nostril, release thumb",
      "Exhale slowly through your right nostril for 4 counts",
      "Inhale through right nostril, then close it with your thumb",
      "Release ring finger and exhale through left nostril",
      "This completes one round - repeat 5-10 rounds",
      "End by breathing normally through both nostrils"
    ],
    color: "bg-gradient-to-br from-slate-50 to-gray-100",
    borderColor: "border-slate-200",
    icon: "🌬️"
  },
]

export default function YogaPage() {
  const [completedPoses, setCompletedPoses] = useState<number[]>([])
  const [showAutoResetConfirm, setShowAutoResetConfirm] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const autoResetTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const saved = localStorage.getItem("completedYogaPoses")
      if (saved) {
        setCompletedPoses(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading completed poses:", error)
      setCompletedPoses([])
    }
  }, [])

  useEffect(() => {
    if (showAutoResetConfirm && timeLeft > 0) {
      autoResetTimerRef.current = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1)
      }, 1000)
    } else if (showAutoResetConfirm && timeLeft === 0) {
      performReset()
    }

    return () => {
      if (autoResetTimerRef.current) {
        clearTimeout(autoResetTimerRef.current)
        autoResetTimerRef.current = null
      }
    }
  }, [showAutoResetConfirm, timeLeft])

  useEffect(() => {
    if (!showAutoResetConfirm && autoResetTimerRef.current) {
      clearTimeout(autoResetTimerRef.current);
      autoResetTimerRef.current = null;
      setTimeLeft(20);
    }
  }, [showAutoResetConfirm]);

  const handlePoseClick = (poseId: number) => {
    router.push(`/wellness/yoga/${poseId}`)
  }

  const performReset = () => {
    setIsResetting(true)
    setShowAutoResetConfirm(false)

    if (autoResetTimerRef.current) {
      clearTimeout(autoResetTimerRef.current)
      autoResetTimerRef.current = null
    }

    setTimeout(() => {
      try {
        localStorage.removeItem("completedYogaPoses")
        setCompletedPoses([])
        setIsResetting(false)
        setTimeLeft(20)
      } catch (error) {
        console.error("Error resetting progress:", error)
        setIsResetting(false)
      }
    }, 500)
  }

  const handleResetProgress = () => {
    performReset()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-50 text-emerald-700 border border-emerald-300"
      case "Intermediate":
        return "bg-amber-50 text-amber-700 border border-amber-300"
      case "Advanced":
        return "bg-rose-50 text-rose-700 border border-rose-300"
      default:
        return "bg-slate-50 text-slate-700 border border-slate-300"
    }
  }

  const completionPercentage = Math.round((completedPoses.length / yogaPoses.length) * 100)

  return (
    <div
      className="min-h-screen font-sans text-slate-900"
      style={{
        background: "linear-gradient(to bottom, #f0f4f8, #e0e8f0)",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          {/* Back button for mobile */}
          <Button
            variant="ghost"
            onClick={() => router.push('/wellness')}
            className="text-slate-500 hover:text-slate-700 px-4 py-2 rounded-full transition-colors font-medium md:hidden"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Floating Back button for desktop */}
          <Button
            variant="ghost"
            onClick={() => router.push('/wellness')}
            className="text-slate-500 hover:text-slate-700 px-4 py-2 rounded-full transition-colors font-medium hidden md:flex"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wellness
          </Button>

          {/* Reset Button */}
          {completedPoses.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowAutoResetConfirm(true)}
              className="text-slate-500 hover:text-rose-600 border-slate-300 hover:border-rose-400 bg-white/50 hover:bg-rose-50 transition-colors rounded-full backdrop-blur-sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Progress
            </Button>
          )}
        </div>

        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Stress-Relief Yoga
          </h1>
          <div className="w-24 h-2 bg-gradient-to-r from-blue-400 to-teal-500 mx-auto rounded-full mb-6"></div>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
            Find your inner peace through mindful movement and breath. These practices are designed to help you manage stress, calm your mind, and restore emotional balance.
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-12">
          <Card className="max-w-md mx-auto bg-white/70 border border-slate-200 rounded-2xl shadow-lg p-6 backdrop-blur-lg transition-all duration-500 hover:shadow-xl">
            <CardContent className="p-0 text-center">
              <h3 className="text-xl font-semibold text-slate-800 mb-1">Your Yoga Journey</h3>
              <p className="text-sm text-slate-500 mb-4">
                {completedPoses.length === 0 ? "Let's begin your mindful journey." :
                  completedPoses.length < yogaPoses.length / 2 ? "You're making great progress! Keep it up." :
                    completedPoses.length < yogaPoses.length ? "You're almost there! Just a few more to go." :
                      "You have completed all practices! ⭐ A true yogi!"}
              </p>

              <div className="flex items-center justify-center gap-2 text-slate-600 mb-4 font-medium">
                {completionPercentage === 100 ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                ) : (
                  <span className="text-sm font-bold text-slate-700">{completionPercentage}%</span>
                )}
                <span className="text-sm">
                  {completedPoses.length} of {yogaPoses.length} practices completed
                </span>
                {completionPercentage === 100 && (
                  <Star className="h-5 w-5 text-amber-400 fill-current animate-pulse ml-1" />
                )}
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Yoga Poses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yogaPoses.map((pose, index) => {
            const isCompleted = completedPoses.includes(pose.id)
            return (
              <Card
                key={pose.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl relative group rounded-3xl ${pose.color} border-2 ${pose.borderColor}`}
                onClick={() => handlePoseClick(pose.id)}
              >
                {/* Combined Content & Icon */}
                <CardContent className="p-3 flex flex-col justify-between h-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="text-2xl font-bold text-slate-400">{index + 1}.</div>
                        <div className="text-4xl">{pose.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-slate-800 leading-tight">
                            {pose.name}
                          </h3>
                          <p className="text-xm text-slate-600 italic font-medium">{pose.sanskritName}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getDifficultyColor(pose.difficulty)} text-[10px] font-medium px-1.5 py-0.5 rounded-full`}>
                            {pose.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-slate-600 text-xs font-medium">
                            <Clock className="h-3 w-3" />
                            <span>{pose.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-start gap-1.5">
                        <Heart className="h-3 w-3 text-rose-500 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-600 text-xs leading-snug">{pose.benefits}</p>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Brain className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-600 text-xs font-semibold">Best for: {pose.bestFor}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className={`mt-6 flex-shrink-0 w-full transition-all duration-300 font-semibold text-sm h-10 rounded-full group-hover:bg-slate-50 ${isCompleted
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-md"
                      : "bg-white/80 backdrop-blur-sm hover:bg-white text-slate-800 border border-slate-300 shadow-sm hover:shadow-lg"
                      }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-5 w-5 mr-2 group-hover:hidden" />
                        <span className="hidden group-hover:inline">Start Practice</span>
                      </>
                    )}
                  </Button>
                </CardContent>
                {isCompleted && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-full p-1.5 shadow-md">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Fixed Automatic Reset Confirmation Dialog */}
        <Dialog open={showAutoResetConfirm} onOpenChange={setShowAutoResetConfirm}>
          <DialogContent className="sm:max-w-md p-10 bg-white rounded-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <DialogHeader className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-rose-100 mb-4">
                <Trash2 className="h-10 w-10 text-rose-600" />
              </div>
              <DialogTitle className="text-3xl font-bold text-slate-900 mb-2">Reset Progress?</DialogTitle>
              <DialogDescription className="text-slate-600 leading-relaxed text-base">
                Your progress will be reset in {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setShowAutoResetConfirm(false)}
                className="flex-1 h-12 rounded-full border-slate-300 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetProgress}
                disabled={isResetting}
                className="flex-1 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white border-0 font-semibold"
              >
                {isResetting ? "Resetting..." : "Reset Now"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm">
            Take your time with each practice. Listen to your body and breathe mindfully.
          </p>
        </div>
      </div>
    </div>
  )
}