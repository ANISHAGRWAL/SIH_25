"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import the hook

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current path

  return (
    <div className="min-h-screen bg-blue-50 font-sans text-slate-800">
      {/* Main desktop header */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        {/* Left side: Logo */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900">MindMates</span>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex-1 flex justify-center">
          <nav className="flex items-center gap-6 text-slate-600">
            <Link href="#" className="font-medium hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="#" className="font-medium hover:text-slate-900 transition-colors">
              Services
            </Link>
            <Link href="#" className="font-medium hover:text-slate-900 transition-colors">
              Contact
            </Link>
            <Link href="#" className="font-medium hover:text-slate-900 transition-colors">
              Blogs
            </Link>
          </nav>
        </div>
        
        {/* Right side: Profile button */}
        <div className="flex items-center">
          <button className="rounded-full px-5 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Profile
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] gap-6 p-4 md:p-8">
        {/* Sidebar */}
        <aside className="hidden md:block bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <Image src="/diverse-avatars.png" alt="Profile avatar" width={64} height={64} className="rounded-full border-2 border-white shadow-md" />
            <div>
              <p className="font-bold text-lg">Amar</p>
              <p className="text-slate-500 text-sm">amar@example.com</p>
            </div>
          </div>
          <nav className="space-y-3">
            <SideLink href="/dashboard" label="Dashboard" isActive={pathname === "/dashboard"} />
            <SideLink href="/chatbot" label="Chat Bot" isActive={pathname === "/chatbot"} />
            <SideLink href="/mind-log" label="Daily Mind Log" isActive={pathname === "/mind-log"} />
            <SideLink href="/psych-tests" label="Psych Test" isActive={pathname === "/psych-tests"} />
            <SideLink href="/book-session" label="Book Session" isActive={pathname === "/book-session"} />
            <SideLink href="/expert-support" label="Expert Support" isActive={pathname === "/expert-support"} />
            <div className="border-t border-gray-200 my-4"></div>
            <SideLink href="/admin/analytics" label="Admin Analytics" isActive={pathname === "/admin/analytics"} />
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-h-[80vh] bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl">
          {children}
        </main>
      </div>

      {/* Mobile nav bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 safe-area-bottom">
        <nav className="flex items-center justify-around px-2 py-3">
          <MobileLink href="/dashboard" label="Home" isActive={pathname === "/dashboard"} />
          <MobileLink href="/chatbot" label="Chat" isActive={pathname === "/chatbot"} />
          <MobileLink href="/mind-log" label="Log" isActive={pathname === "/mind-log"} />
          <MobileLink href="/expert-support" label="Support" isActive={pathname === "/expert-support"} />
          <MobileLink href="#" label="More" />
        </nav>
      </footer>
    </div>
  );
}

function SideLink({ href, label, isActive = false }: { href: string; label: string; isActive?: boolean }) {
  const activeClasses = "bg-white text-blue-600 border border-blue-200 shadow-md";
  const inactiveClasses = "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900";

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-xl px-4 py-3 font-semibold transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function MobileLink({ href, label, isActive = false }: { href: string; label: string; isActive?: boolean }) {
  const activeClasses = "text-blue-600";
  const inactiveClasses = "text-slate-500";

  return (
    <Link href={href} className={`flex flex-col items-center gap-1 text-xs transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
      <span className={`w-5 h-5 rounded-full ${isActive ? 'bg-blue-300' : 'bg-slate-300/60'}`} />
      <span>{label}</span>
    </Link>
  );
}