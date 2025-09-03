import { StatusDot } from "@/components/status-dot"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold">Welcome Anekant,</h2>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="col-span-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="text-center font-medium text-slate-700 mb-3">Express your feeling</p>
          <div className="flex items-center justify-center gap-4">
            {["#22c55e", "#6ee7b7", "#fbbf24", "#f97316", "#ef4444"].map((c, i) => (
              <button
                key={i}
                aria-label={`mood-${i}`}
                className="size-12 rounded-full shadow-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="font-medium">Start Face Check-In</p>
            <StatusDot status="success" />
          </div>
          <div className="mt-3 h-28 rounded-xl bg-slate-50 flex items-center justify-center">
            <span className="text-slate-400">Face scan placeholder</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="font-medium">Start Voice Mood Check</p>
            <StatusDot status="pending" />
          </div>
          <div className="mt-3 h-28 rounded-xl bg-slate-50 flex items-center justify-center">
            <span className="text-slate-400">Microphone placeholder</span>
          </div>
        </div>

        <div className="col-span-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <div className="h-24 rounded-xl bg-gradient-to-r from-fuchsia-400 to-indigo-500/70 flex items-center justify-center gap-4 px-6">
            <button className="size-10 rounded-full bg-white/85" aria-label="Play">
              ▶
            </button>
            <button className="size-10 rounded-full bg-white/85" aria-label="Pause">
              ⏸
            </button>
            <button className="size-10 rounded-full bg-white/85" aria-label="Next">
              »
            </button>
          </div>
        </div>

        <div className="col-span-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/woman-in-nature-yoga.png" alt="" className="h-12 w-12" />
            <div>
              <p className="font-semibold">Your 5-minute mental detox</p>
              <p className="text-sm text-slate-600">Guided stretches to refresh focus and ease stress.</p>
            </div>
          </div>
          <button className="rounded-full px-4 py-2 bg-slate-800 text-white">Start Now</button>
        </div>
      </section>
    </div>
  )
}
