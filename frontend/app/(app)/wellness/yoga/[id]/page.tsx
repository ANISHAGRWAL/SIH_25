import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, Brain, ArrowLeft, CheckCircle } from "lucide-react"
import YogaPoseClient from "./YogaPoseClient"

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

// The server function that runs at build time
export async function generateStaticParams() {
  return yogaPoses.map((pose) => ({
    id: pose.id.toString(),
  }));
}

// The Server Component. It fetches data and passes it to the Client Component.
export default function YogaPosePage({ params }: { params: { id: string } }) {
  const poseId = Number.parseInt(params.id);
  const pose = yogaPoses.find((p) => p.id === poseId);

  if (!pose) {
    // Return a basic, non-interactive "not found" page
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Pose not found</h1>
          {/* A simple link to avoid client-side useRouter here */}
          <a href="/wellness/yoga">
            <Button>Back to Yoga Poses</Button>
          </a>
        </div>
      </div>
    );
  }

  // Render the Client Component and pass the pose data as a prop
  return <YogaPoseClient pose={pose} />;
}