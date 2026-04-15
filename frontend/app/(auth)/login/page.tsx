"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { login } from "@/actions/auth";
import ForgotPasswordModal from "@/components/forgetPassword";

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, token, loading, getTokens, isAdmin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);

    // You can change this image URL to any image you want for the center
    const centerImage = "/login.png";

    useEffect(() => {
        if (!loading && isAuthenticated && token) {
            if (isAdmin) {
                router.push("/admin-dashboard");
            } else {
                router.push("/dashboard");
            }
        }
    }, [loading, isAuthenticated, token, isAdmin, router]);

    // Clear error when user starts typing
    useEffect(() => {
        if (error) {
            setError("");
        }
    }, [email, password]);

    async function handleLogin(e: React.FormEvent) { // Corrected: Explicitly typed 'e'
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const res = await login({ email, password });

            console.log("response", res);
            const data = res?.data;
            if (data?.success && data?.data) {
                localStorage.setItem("token", data.data.token);
                getTokens(); // Sync AuthContext with new token
            } else {
                // Set specific error message based on response
                if (data?.message) {
                    setError(data.message);
                } else {
                    setError("Invalid email or password. Please try again.");
                }
            }
        } catch (err: any) { // Corrected: Explicitly typed 'err' as 'any'
            console.error(err);
            // Handle different types of errors
            if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err?.message) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading || (isAuthenticated && token)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-blue-100 flex items-center justify-center bg-white shadow-lg">
                            <Image src="/logoicon.png" alt="Campus Care" width={48} height={48} className="opacity-90" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Loading your space…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60">
            {/* Left Side – brand panel */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 items-center justify-center p-16">
                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />
                <div className="absolute top-1/3 right-0 w-60 h-60 rounded-full bg-violet-500/15 blur-2xl" />

                <div className="relative z-10 text-center max-w-md">
                    <div className="mb-8 inline-flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 border border-white/15">
                        <Image src="/logoicon.png" alt="Campus Care" width={32} height={32} />
                        <span className="text-white font-bold text-lg tracking-tight">Campus Care</span>
                    </div>
                    <img src="/login.png" alt="Mental wellness illustration" className="w-72 h-72 object-contain mx-auto mb-8 drop-shadow-2xl" />
                    <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
                        Your Mental Wellness<br />Journey Starts Here
                    </h2>
                    <p className="text-blue-100 text-base leading-relaxed">
                        Connect with expert support, track your progress, and discover tools for better mental health.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-6 text-blue-100/80 text-sm">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            Confidential
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            Secure
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            Always Available
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side – Login Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-14">
                <div className="w-full max-w-[420px]">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <Image src="/logoicon.png" alt="Campus Care" width={36} height={36} />
                        <span className="font-bold text-slate-800 text-xl">Campus Care</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
                        <p className="text-slate-500 mt-1.5">Sign in to continue to your account</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                        {/* Login Form */}
                        <form className="space-y-5" onSubmit={handleLogin}>
                            {/* Error Message */}
                            {error && (
                                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <div>
                                <label className="mc-label">Email address</label>
                                <input
                                    type="email"
                                    required
                                    className={`mc-input ${error ? "border-red-300 focus:border-red-400" : ""}`}
                                    placeholder="you@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="mc-label mb-0">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(true)}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    required
                                    className={`mc-input ${error ? "border-red-300 focus:border-red-400" : ""}`}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mc-btn-primary w-full py-3 text-base mt-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>

            <ForgotPasswordModal
                isOpen={showForgotModal}
                onClose={() => setShowForgotModal(false)}
            />
        </div>
    );
}