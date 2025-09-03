import { StatusDot } from "@/components/status-dot"

const tests = [
  {
    key: "phq9",
    title: "PHQ-9 (Patient Health Questionnaire-9)",
    desc: "Screen for symptoms of depression over the past 2 weeks.",
    status: "success" as const,
  },
  {
    key: "gad7",
    title: "GAD-7 (Generalized Anxiety Disorder-7)",
    desc: "Evaluate persistent anxiety and worry over the last 2 weeks.",
    status: "ongoing" as const,
  },
  {
    key: "pss",
    title: "PSS (Perceived Stress Scale)",
    desc: "Measure overall perception of stress over the past month.",
    status: "pending" as const,
  },
]

export default function PsychTestsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Psych Tests</h2>
      <div className="space-y-4">
        {tests.map((t) => (
          <article key={t.key} className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-100" />
            <div className="flex-1">
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-slate-600">{t.desc}</p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <StatusDot status={t.status} />
                <span className="capitalize">{t.status === "success" ? "Successful" : t.status}</span>
              </div>
            </div>
            <button
              aria-label="Start test"
              className="rounded-full size-10 grid place-items-center bg-gradient-to-r from-teal-400 to-sky-700 text-white"
            >
              ▶
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
