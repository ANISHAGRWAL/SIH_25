"use client";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, token, loading, getTokens, isAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await login({ email, password });

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
          setError("Invalid email or password. Please try again.");
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
              alt="Mental health and wellness"
              className="w-96 h-96 object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-[#7586FF]">
              Your Mental Wellness Journey
            </h2>
            <p className="text-xl text-[#3780FF] leading-relaxed">
              Connect with expert support, track your progress, and discover
              tools for better mental health.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Glass-like card effect */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 space-y-8">
            {/* Logo/Brand */}
            <div className="text-center">
              <Image 
              className="mx-auto pb-2"
              
                src="/logoicon.png" // Path from the 'public' folder
                alt="Sahayog Admin Logo"
                width={52} // Corresponds to w-8
                height={52} // Corresponds to h-8
              />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">Sign in to your Campus Care account</p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-400 mr-2"
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
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm ${error ? "border-red-300" : "border-gray-300"
                    }`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/50 backdrop-blur-sm ${error ? "border-red-300" : "border-gray-300"
                    }`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isSubmitting}
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-400 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
