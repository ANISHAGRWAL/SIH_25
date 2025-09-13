"use client";
import Image from 'next/image';
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { organizations, register } from "@/actions/auth";

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
  }, [form.name, form.email, form.password, form.organizationId, form.contact]);

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

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!form.idFile) {
        setError("Must have to upload the id proof");
        setIsSubmitting(false);
        return;
      }
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
      console.log("response", res);
      const data = res?.data;
      if (data.success && data.data) {
        localStorage.setItem("token", data.data.token);
        getTokens(); // Sync AuthContext with new token
      } else {
        // Set specific error message based on response
        if (data?.message) {
          setError(data.message);
        } else {
          setError("Signup failed. Please try again.");
        }
      }
    } catch (err: any) {
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

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    setStep(2);
  }

  if (loading || (isAuthenticated && token)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Left Side - Centered Image and Text */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center p-12">
        <div className="text-center max-w-md">
          {/* Centered Image */}
          <div className="mb-8">
            <img
              src={centerImage}
              alt={step === 1 ? "Join our community" : "Complete your profile"}
              className="w-92 h-92 object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-[#7586FF]">
              {step === 1 ? "Join Our Community" : "Complete Your Profile"}
            </h2>
            <p className="text-xm text-[#3780FF] leading-relaxed">
              {step === 1
                ? "Create your account and start your mental wellness journey with expert support and personalized tools."
                : "Add your organization details and verification to complete your registration."}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-sm">
          {/* Glass-like card effect */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 space-y-5">
            {/* Logo/Brand */}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Image
                  className="mx-auto pb-2"

                  src="/logoicon.png" // Path from the 'public' folder
                  alt="Sahayog Admin Logo"
                  width={52} // Corresponds to w-8
                  height={52} // Corresponds to h-8
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {step === 1 ? "Create Account" : "Additional Details"}
              </h1>
              <p className="text-sm text-gray-600">
                {step === 1
                  ? "Sign up for your Campus Care account"
                  : "Complete your profile setup"}
              </p>
            </div>

            {/* Role Selection */}
            <div className="flex justify-center">
              <div className="bg-gray-100/80 backdrop-blur-sm rounded-lg flex">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${role === "student"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${role === "admin"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Progress indicator */}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-red-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p className="text-xs text-red-700 font-medium">{error}</p>
                </div>
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
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <LabeledInput
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  disabled={isSubmitting}
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-400 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg text-sm"
                >
                  Next Step
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleSignup}>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-700">
                    Organization
                  </label>
                  <select
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm text-sm"
                    value={form.organizationId}
                    onChange={(e) => update("organizationId", e.target.value)}
                    disabled={isSubmitting || organizationList.length === 0}
                    required
                  >
                    <option value="" disabled>
                      {organizationList.length === 0
                        ? "Loading organizations..."
                        : "Select your organization"}
                    </option>
                    {organizationList.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                <LabeledInput
                  label="Contact Number"
                  placeholder="Enter your contact number"
                  value={form.contact}
                  onChange={(e) => update("contact", e.target.value)}
                  disabled={isSubmitting}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-700">
                    ID Proof
                  </label>
                  <input
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-xs"
                    type="file"
                    onChange={(e) => update("idFile", e.target.files?.[0])}
                    disabled={isSubmitting}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-2 bg-gradient-to-r from-blue-500 to-indigo-400 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg text-sm"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-xs text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
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
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm placeholder:text-gray-400 text-sm"
      />
    </div>
  );
}
