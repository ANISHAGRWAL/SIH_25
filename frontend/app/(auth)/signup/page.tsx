"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { organizations, register, sendOtp, verifyOtp } from "@/actions/auth";

export default function SignupPage() {
    const router = useRouter();
    const { isAuthenticated, token, loading, getTokens, isAdmin } = useAuth();

    const [role, setRole] = useState<"student" | "admin">("student");
    const [step, setStep] = useState<1 | 2>(1);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        organizationId: "",
        contact: "",
        idFile: undefined as File | undefined,
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [organizationList, setOrganizationList] = useState<
        { id: string; name: string }[]
    >([]);

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    // You can change this image URL to any image you want for the center
    const centerImage = step === 1 ? "/login.png" : "/login.png";

    // Redirect if already authenticated
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
    }, [
        form.name,
        form.email,
        form.password,
        form.organizationId,
        form.contact,
        otp,
    ]);

    useEffect(() => {
        if (step === 2) {
            (async () => {
                const res = await organizations();
                if (res.ok && res.data) {
                    setOrganizationList(res.data);
                } else {
                    setError("Failed to load organizations. Try again.");
                }
            })();
        }
    }, [step]);

    function update<K extends keyof typeof form>(
        key: K,
        value: (typeof form)[K]
    ) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email) {
            setError("Please enter email before sending OTP.");
            return;
        }
        setIsSendingOtp(true);
        setError("");
        const res = await sendOtp(form.email);
        if (res.ok) {
            setOtpSent(true);
        } else {
            setError(res.data?.message || "Failed to send OTP.");
        }
        setIsSendingOtp(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !otp) {
            setError("Please enter OTP.");
            return;
        }
        setIsVerifyingOtp(true);
        setError("");
        const res = await verifyOtp(form.email, otp);
        if (res.ok) {
            setIsOtpVerified(true);
            // optionally show message
        } else {
            setError(res.data?.message || "OTP verification failed.");
        }
        setIsVerifyingOtp(false);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        if (!form.idFile) {
            setError("Must upload the ID proof.");
            setIsSubmitting(false);
            return;
        }
        try {
            const body = {
                name: form.name,
                email: form.email,
                password: form.password,
                role,
                organizationId: form.organizationId,
                contact: form.contact,
                idFile: form.idFile,
            };
            const res = await register(body);
            const data = res?.data;
            if (res.ok && data.success && data.data) {
                localStorage.setItem("token", data.data.token);
                getTokens();
            } else {
                setError(data.message || "Signup failed. Please try again.");
            }
        } catch (err: any) {
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
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        // check name, password also? but at least name & password
        if (!form.name || !form.email || !form.password) {
            setError("Please fill in name, email, and password.");
            return;
        }
        // Also ensure email is verified via OTP
        if (!isOtpVerified) {
            setError("Please verify your email via OTP before proceeding.");
            return;
        }
        setStep(2);
    };

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
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />

                <div className="relative z-10 text-center max-w-md">
                    <div className="mb-8 inline-flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 border border-white/15">
                        <Image src="/logoicon.png" alt="Campus Care" width={32} height={32} />
                        <span className="text-white font-bold text-lg tracking-tight">Campus Care</span>
                    </div>
                    <img
                        src="/login.png"
                        alt={step === 1 ? "Join our community" : "Complete your profile"}
                        className="w-64 h-64 object-contain mx-auto mb-8 drop-shadow-2xl transition-all duration-500"
                    />
                    <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
                        {step === 1 ? "Join Our Community" : "Almost There!"}
                    </h2>
                    <p className="text-blue-100 text-base leading-relaxed">
                        {step === 1
                            ? "Create your account and start your mental wellness journey with expert support and personalized tools."
                            : "Add your organization details to complete your registration."}
                    </p>
                    {/* Step dots */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? "w-6 bg-white" : "w-2 bg-white/40"}`} />
                        <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? "w-6 bg-white" : "w-2 bg-white/40"}`} />
                    </div>
                </div>
            </div>

            {/* Right Side – Signup Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-14">
                <div className="w-full max-w-[420px]">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-6">
                        <Image src="/logoicon.png" alt="Campus Care" width={36} height={36} />
                        <span className="font-bold text-slate-800 text-xl">Campus Care</span>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {step === 1 ? "Create your account" : "Complete your profile"}
                            </h1>
                        </div>
                        <p className="text-slate-500 text-sm">
                            {step === 1 ? "Step 1 of 2 — Basic info" : "Step 2 of 2 — Organization"}
                        </p>
                    </div>

                    {/* Role toggle */}
                    <div className="flex mb-5 bg-slate-100 rounded-xl p-1">
                        {(["student", "admin"] as const).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
                                    role === r
                                        ? "bg-white text-blue-700 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <p className="text-xs text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Forms */}
                        {step === 1 ? (
                            <form className="space-y-4" onSubmit={handleNext}>
                                <LabeledInput
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={(e) => update("name", e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                                <LabeledInput
                                    label="Email Address"
                                    type="email"
                                    placeholder="you@university.edu"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={isSendingOtp || !form.email}
                                        className="flex-1 mc-btn-secondary py-2.5 text-xs"
                                    >
                                        {isSendingOtp ? "Sending…" : otpSent ? "Resend OTP" : "Send OTP"}
                                    </button>
                                </div>
                                {otpSent && (
                                    <div className="space-y-2">
                                        <LabeledInput
                                            label="Enter OTP"
                                            type="text"
                                            placeholder="6-digit code"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            disabled={isVerifyingOtp || isOtpVerified}
                                            required
                                        />
                                        {!isOtpVerified && (
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={isVerifyingOtp || !otp}
                                                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                                            >
                                                {isVerifyingOtp ? "Verifying…" : "Verify OTP"}
                                            </button>
                                        )}
                                        {isOtpVerified && (
                                            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Email verified
                                            </div>
                                        )}
                                    </div>
                                )}
                                <LabeledInput
                                    label="Password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={form.password}
                                    onChange={(e) => update("password", e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !form.name || !form.email || !form.password || !isOtpVerified}
                                    className="mc-btn-primary w-full py-2.5"
                                >
                                    Continue
                                </button>
                            </form>
                        ) : (
                            <form className="space-y-4" onSubmit={handleSignup}>
                                <div>
                                    <label className="mc-label">Organization</label>
                                    <select
                                        className="mc-input"
                                        value={form.organizationId}
                                        onChange={(e) => update("organizationId", e.target.value)}
                                        disabled={isSubmitting || organizationList.length === 0}
                                        required
                                    >
                                        <option value="" disabled>
                                            {organizationList.length === 0 ? "Loading…" : "Select your organization"}
                                        </option>
                                        {organizationList.map((org) => (
                                            <option key={org.id} value={org.id}>{org.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <LabeledInput
                                    label="Contact Number"
                                    placeholder="Your phone number"
                                    value={form.contact}
                                    onChange={(e) => update("contact", e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />

                                <div>
                                    <label className="mc-label">ID Proof</label>
                                    <input
                                        className="mc-input file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-xs"
                                        type="file"
                                        onChange={(e) => update("idFile", e.target.files?.[0])}
                                        disabled={isSubmitting}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        disabled={isSubmitting}
                                        className="mc-btn-secondary flex-1 py-2.5 text-sm"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="mc-btn-primary flex-1 py-2.5 text-sm"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                Creating…
                                            </>
                                        ) : "Create Account"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-slate-500 mt-5">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function LabeledInput({
    label,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    return (
        <div>
            <label className="mc-label">{label}</label>
            <input
                {...props}
                className="mc-input"
            />
        </div>
    );
}