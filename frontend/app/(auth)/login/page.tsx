"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SplitPane from "@/components/auth/split-pane";
import { GradientButton } from "@/components/gradient-button";
import Link from "next/link";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, token, loading, getTokens } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated && token) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, token, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await login({ email, password });

      console.log("response", res);
      const data = res?.data;
      if (data.success && data.data) {
        localStorage.setItem("token", data.data.token);
        getTokens(); // Sync AuthContext with new token
        router.push("/dashboard");
      } else {
        alert("Login failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  if (loading || (isAuthenticated && token)) {
    return null; // Or spinner
  }

  return (
    <SplitPane
      isLoginPage={true}
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
      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-2">
          <label className="text-slate-700 text-sm font-medium">Email</label>
          <input
            className="w-full rounded-full border border-slate-300 px-4 py-3"
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-slate-700 text-sm font-medium">Password</label>
          <input
            className="w-full rounded-full border border-slate-300 px-4 py-3"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <GradientButton asFull type="submit">
          Log In
        </GradientButton>
      </form>
    </SplitPane>
  );
}
