"use client"

import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { asFull?: boolean }

export function GradientButton({ className, asFull, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-white font-medium shadow-sm transition-colors",
        // teal -> blue gradient to match references
        "bg-gradient-to-r from-teal-400 to-sky-700 hover:from-teal-500 hover:to-sky-800 focus:outline-none focus:ring-2 focus:ring-teal-300",
        asFull ? "w-full" : "",
        className,
      )}
    />
  )
}
