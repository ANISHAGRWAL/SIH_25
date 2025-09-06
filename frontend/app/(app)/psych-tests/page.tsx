import { StatusDot } from "@/components/status-dot"
import Link from "next/link"

const tests = [
  {
    key: "phq9",
    title: "PHQ-9 (Patient Health Questionnaire-9)",
    desc: "A quick self-assessment to screen for symptoms of depression. Understand how your mood and interest levels have changed over the past 2 weeks.",
    status: "success" as const,
    href: "/psych-tests/phq9",
    icon: "🧠",
    bgColor: "bg-blue-50",
    estimatedTime: "5-10 min",
  },
  {
    key: "gad7",
    title: "GAD-7 (Generalized Anxiety Disorder-7)",
    desc: "Helps identify signs of persistent anxiety and worry. Evaluate how anxiety has been affecting your thoughts and daily life over the last 2 weeks.",
    status: "ongoing" as const,
    href: "/psych-tests/gad7",
    icon: "💭",
    bgColor: "bg-purple-50",
    estimatedTime: "3-7 min",
  },
  {
    key: "pss",
    title: "PSS (Perceived Stress Scale)",
    desc: "Measures your overall perception of stress over the past month. Get insights into how overwhelmed, in control, or stressed you've been feeling lately.",
    status: "pending" as const,
    href: "/psych-tests/pss",
    icon: "📊",
    bgColor: "bg-green-50",
    estimatedTime: "8-12 min",
  },
]

const getButtonText = (status: string) => {
  switch (status) {
    case "success":
      return "Retake"
    case "ongoing":
      return "Continue"
    default:
      return "Start Test"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "success":
      return "Completed"
    case "ongoing":
      return "In Progress"
    default:
      return "Available"
  }
}

export default function PsychTestsPage() {
  return (
    <div className="space-y-12 py-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
          Psychological Assessments
        </h1>
        <p className="mt-2 text-md text-slate-600">
          Explore a range of validated tests to better understand your mental health.
        </p>
      </header>
      
      <section className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div 
              key={test.key} 
              className="group relative rounded-3xl bg-white p-8 ring-1 ring-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div 
                className={`w-16 h-16 ${test.bgColor} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105`}
              >
                <span className="text-3xl">{test.icon}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{test.title}</h3>
              
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {test.desc}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                <span className="font-medium text-gray-600">
                  {getStatusText(test.status)}
                </span>
                <span>•</span>
                <span>{test.estimatedTime}</span>
              </div>
              
              <Link href={test.href} className="w-full">
                <button 
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 font-semibold text-sm
                    group-hover:-translate-y-1"
                >
                  {getButtonText(test.status)}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-12 border-t border-slate-200" />
      
      <section className="rounded-3xl bg-slate-50 p-8 shadow-inner">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">ℹ️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Why Take These Tests?
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            These psychological assessments are here to empower you with valuable insights. All responses are confidential and can serve as a starting point for deeper self-awareness and informed conversations with a healthcare professional. They are not a substitute for a diagnosis.
          </p>
        </div>
      </section>
    </div>
  )
}