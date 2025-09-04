"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SplitPane({
  children,
  activeRole = "student",
  onRoleChange,
  rightTitle = "WELCOME!",
  rightSubtitle = (
    <p className="text-sm text-slate-500">
      Already have an Account,{" "}
      <Link href="/login" className="text-sky-700 hover:underline">
        Log in
      </Link>
    </p>
  ),
  leftImage = "/images/signup-step1.jpg",
}: {
  children: React.ReactNode;
  activeRole?: "student" | "admin";
  onRoleChange?: (role: "student" | "admin") => void;
  rightTitle?: string;
  rightSubtitle?: React.ReactNode;
  leftImage?: string;
}) {
  return (
    <div className="min-h-[100dvh] grid md:grid-cols-2 bg-[#EFF9FA]">
      <div className="hidden md:flex items-center justify-center p-8">
        <figure className="relative w-full max-w-md aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <Image
            src={leftImage || "/placeholder.svg"}
            alt="Signup reference illustration"
            fill
            className="object-cover"
            priority
          />
        </figure>
      </div>

      <div className="bg-white p-6 md:p-12 flex flex-col gap-6 justify-center">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-wide text-slate-800">
            {rightTitle}
          </h1>
          {rightSubtitle}
        </header>

        <div className="flex gap-4">
          <button
            onClick={() => onRoleChange?.("student")}
            className={cn(
              "rounded-full px-6 py-2 ring-1 ring-slate-300 shadow-sm",
              activeRole === "student"
                ? "bg-gradient-to-r from-teal-400 to-sky-700 text-white"
                : "bg-white text-slate-700"
            )}
          >
            Student
          </button>
          <button
            onClick={() => onRoleChange?.("admin")}
            className={cn(
              "rounded-full px-6 py-2 ring-1 ring-slate-300 shadow-sm",
              activeRole === "admin"
                ? "bg-gradient-to-r from-teal-400 to-sky-700 text-white"
                : "bg-white text-slate-700"
            )}
          >
            Admin
          </button>
        </div>

        <div className="max-w-md">{children}</div>
      </div>
    </div>
  );
}
