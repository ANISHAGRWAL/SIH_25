import { cn } from "@/lib/utils"

export function StatusDot({ status }: { status: "success" | "ongoing" | "pending" }) {
  // Limit palette: success=green, ongoing=teal (primary), pending=red
  const color = status === "success" ? "bg-emerald-500" : status === "pending" ? "bg-red-500" : "bg-teal-500"
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", color)} aria-hidden="true" />
}
