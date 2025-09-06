"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SplitPane from "@/components/auth/split-pane";
import { GradientButton } from "@/components/gradient-button";
import { register } from "@/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, token, loading, getTokens } = useAuth();

  const [role, setRole] = useState<"student" | "admin">("student");
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
    contact: "",
    idFile: undefined as File | undefined,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && token) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, token, router]);

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    try {
      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        organization: form.organization,
        contact: form.contact,
        idFile: form.idFile,
      };

      const res = await register(body);
      const data = res?.data;
      if (data.success && data.data) {
        localStorage.setItem("token", data.data.token);
        getTokens(); // Sync AuthContext
        router.push("/dashboard");
      } else {
        alert("Signup failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  if (loading || (isAuthenticated && token)) {
    return null; // Or loading spinner
  }

  return (
    <SplitPane
      isLoginPage={false}
      activeRole={role}
      onRoleChange={setRole}
      rightTitle="WELCOME!"
      leftImage={
        step === 1 ? "/images/signup-step1.jpg" : "/images/signup-step2.jpg"
      }
    >
      {step === 1 ? (
        <div className="space-y-4">
          <LabeledInput
            label="Full Name"
            placeholder="Ashika Jain"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          <LabeledInput
            label="Email"
            type="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <LabeledInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
          />
          <GradientButton asFull onClick={() => setStep(2)}>
            Next
          </GradientButton>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSignup}>
          <LabeledInput
            label="Organization"
            placeholder="Techno Main Salt Lake"
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
          />
          <LabeledInput
            label="Contact"
            placeholder="+91 78233 18393"
            value={form.contact}
            onChange={(e) => update("contact", e.target.value)}
          />
          <div className="space-y-2">
            <label className="text-slate-700 text-sm font-medium">
              ID Proof
            </label>
            <input
              className="w-full rounded-full border border-slate-300 px-4 py-3"
              type="file"
              onChange={(e) => update("idFile", e.target.files?.[0])}
            />
          </div>
          <div className="flex gap-3">
            <GradientButton
              type="button"
              className="min-w-28"
              onClick={() => setStep(1)}
            >
              Back
            </GradientButton>
            <GradientButton asFull type="submit">
              Sign Up
            </GradientButton>
          </div>
        </form>
      )}
    </SplitPane>
  );
}

function LabeledInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="space-y-2">
      <label className="text-slate-700 text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full rounded-full border border-slate-300 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
    </div>
  );
}
