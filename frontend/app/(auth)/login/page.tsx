"use client"

import SplitPane from "@/components/auth/split-pane"
import Link from "next/link"
import { GradientButton } from "@/components/gradient-button"

export default function LoginPage() {
  return (
    <SplitPane
      rightTitle="WELCOME BACK!"
      rightSubtitle={
        <p className="text-sm text-slate-500">
          New here?{" "}
          <Link href="/signup" className="text-sky-700 hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          // TODO: authenticate against your backend
          location.href = "/dashboard"
        }}
      >
        <div className="space-y-2">
          <label className="text-slate-700 text-sm font-medium">Email</label>
          <input
            className="w-full rounded-full border border-slate-300 px-4 py-3"
            type="email"
            placeholder="name@email.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-slate-700 text-sm font-medium">Password</label>
          <input
            className="w-full rounded-full border border-slate-300 px-4 py-3"
            type="password"
            placeholder="••••••••"
          />
        </div>
        <GradientButton asFull type="submit">
          Log In
        </GradientButton>
      </form>
    </SplitPane>
  )
}
