import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, Brain, ArrowLeft, CheckCircle } from "lucide-react"
import YogaPoseClient from "./YogaPoseClient"

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
    color: "from-green-100 to-emerald-100",
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
    color: "from-blue-100 to-sky-100",
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
    color: "from-purple-100 to-violet-100",
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
    color: "from-orange-100 to-amber-100",
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
    color: "from-indigo-100 to-purple-100",
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
    color: "from-teal-100 to-cyan-100",
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
    color: "from-pink-100 to-rose-100",
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
    color: "from-emerald-100 to-green-100",
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
    color: "from-amber-100 to-yellow-100",
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
    color: "from-slate-100 to-gray-100",
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
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Practice not found</h1>
          {/* A simple link to avoid client-side useRouter here */}
          <a href="/wellness/yoga">
            <Button>Back to Yoga Practices</Button>
          </a>
        </div>
      </div>
    );
  }

  // Render the Client Component and pass the pose data as a prop
  return <YogaPoseClient pose={pose} />;
}