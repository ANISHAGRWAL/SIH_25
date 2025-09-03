import type React from "react"
import Link from "next/link"
import Image from "next/image"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#EFF9FA]">
      <header className="hidden md:flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-slate-900" />
          <span className="font-semibold">MindMates</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-slate-600">
          <Link href="#" className="hover:text-slate-900">
            Home
          </Link>
          <Link href="#" className="hover:text-slate-900">
            Services
          </Link>
          <Link href="#" className="hover:text-slate-900">
            Contact
          </Link>
          <Link href="#" className="hover:text-slate-900">
            Blogs
          </Link>
          <button className="rounded-full px-5 py-2 bg-gradient-to-r from-teal-400 to-sky-700 text-white">
            Profile
          </button>
        </nav>
      </header>

      <div className="grid md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block p-6">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/diverse-avatars.png" alt="Profile avatar" width={48} height={48} className="rounded-full" />
            <div>
              <p className="font-medium">Anekant</p>
            </div>
          </div>
          <nav className="space-y-2 text-slate-600">
            <SideLink href="/dashboard" label="Dashboard" />
            <SideLink href="/chatbot" label="Chat Bot" />
            <SideLink href="/mind-log" label="Daily Mind Log" />
            <SideLink href="/psych-tests" label="Psych Test" />
            <SideLink href="/book-session" label="Book Session" />
            <SideLink href="/expert-support" label="Expert Support" />
            {/* Admin Analytics link added here */}
            <SideLink href="/admin/analytics" label="Admin Analytics" />
          </nav>
        </aside>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

function SideLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className={
        "flex items-center gap-3 rounded-full px-4 py-2 hover:bg-white hover:shadow-sm ring-1 ring-transparent hover:ring-slate-200"
      }
    >
      <span className="h-5 w-5 rounded-full bg-slate-400/40" />
      <span className="font-medium">{label}</span>
    </a>
  )
}
