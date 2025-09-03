import { GradientButton } from "@/components/gradient-button"

const weeks = [3, 2, 1]
const days = ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"]

export default function MindLogPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Daily Mind Log</h2>
      {weeks.map((w) => (
        <section key={w} className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium">Week {w}</p>
            <GradientButton>View Report</GradientButton>
          </div>
          <div className="flex flex-wrap gap-4">
            {days.map((d) => (
              <div key={d} className="flex flex-col items-center">
                <div className="w-16 h-6 rounded-t-xl bg-teal-500" />
                <div className="w-16 h-12 rounded-b-xl bg-white ring-1 ring-slate-200 grid place-items-center font-medium text-slate-700 shadow-sm">
                  {d}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
