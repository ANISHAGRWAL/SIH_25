"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { getTestHistory } from "@/actions/test";

const testsData = [
  {
    key: "phq",
    title: "PHQ-9 (Patient Health Questionnaire-9)",
    desc: "A quick self-assessment to screen for symptoms of depression.",
    icon: "🧠",
    bgColor: "bg-blue-50",
    estimatedTime: "5-10 min",
    cooldownDays: 7,
  },
  {
    key: "gad",
    title: "GAD-7 (Generalized Anxiety Disorder-7)",
    desc: "Helps identify signs of persistent anxiety and worry.",
    icon: "💭",
    bgColor: "bg-purple-50",
    estimatedTime: "3-7 min",
    cooldownDays: 7,
  },
  {
    key: "pss",
    title: "PSS (Perceived Stress Scale)",
    desc: "Measures your overall perception of stress over the past month.",
    icon: "📊",
    bgColor: "bg-green-50",
    estimatedTime: "8-12 min",
    cooldownDays: 30,
  },
];

const getStatusText = (isEligible: boolean) => {
  return isEligible ? "Eligible" : "Not Eligible";
};

// New function to get days until eligible
const getDaysUntilEligible = (lastTakenDate: string | null, cooldownDays: number) => {
  if (!lastTakenDate) {
    return 0; // Test has never been taken
  }
  const lastDate = new Date(lastTakenDate);
  const currentDate = new Date();
  const diffTime = currentDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const remainingDays = cooldownDays - diffDays;
  return Math.max(0, remainingDays);
};

export default function PsychTestsPage() {
  const [loading, setLoading] = useState(true);
  const [testHistory, setTestHistory] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setError("Unauthorized. Please log in.");
        setLoading(false);
        return;
      }

      const res = await getTestHistory(token);
      if (res.ok) {
        setTestHistory(res.data);
      } else {
        setError(res.error || "Failed to load test history.");
        toast.error(res.error || "Failed to load test history.");
      }
      setLoading(false);
    };

    fetchHistory();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center text-slate-600 mt-20 text-lg px-4">
        Loading tests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20 text-lg px-4">
        Error: {error}
      </div>
    );
  }

  const combinedTests = testsData.map(test => {
    const history = testHistory?.[test.key];
    const isEligible = history?.eligible ?? true;
    const lastTaken = history?.lastTest?.takenOn;
    const daysUntilEligible = getDaysUntilEligible(lastTaken, test.cooldownDays);
    
    return {
      ...test,
      isEligible,
      lastTaken: lastTaken ? new Date(lastTaken).toLocaleDateString() : null,
      daysUntilEligible,
    };
  });

  return (
    <div className="space-y-8 sm:space-y-12 py-4 sm:py-8 px-4 sm:px-0">
      {/* Header - Mobile optimized */}
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800 leading-tight">
          Psychological Assessments
        </h1>
        <p className="mt-2 text-sm sm:text-md text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore a range of validated tests to better understand your mental health.
        </p>
      </header>
      
      {/* Tests Grid - Enhanced mobile layout */}
      <section className="space-y-6">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {combinedTests.map((test) => (
            <div 
              key={test.key} 
              className="group relative rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              {/* Icon and Header Section */}
              <div className="flex items-start gap-4 sm:block mb-4">
                <div 
                  className={`w-12 h-12 sm:w-16 sm:h-16 ${test.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
                >
                  <span className="text-2xl sm:text-3xl">{test.icon}</span>
                </div>
                
                {/* Mobile: Title next to icon, Desktop: Below icon */}
                <div className="flex-1 sm:mt-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight sm:leading-normal mb-1 sm:mb-2">
                    {test.title}
                  </h3>
                  
                  {/* Mobile: Show status badge prominently */}
                  <div className="sm:hidden">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      test.isEligible 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {getStatusText(test.isEligible)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {test.desc}
              </p>
              
              {/* Status and Time Info - Desktop version */}
              <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400 mb-6">
                <span className={`font-medium ${test.isEligible ? 'text-green-600' : 'text-red-500'}`}>
                  {getStatusText(test.isEligible)}
                </span>
                <span>•</span>
                <span>{test.estimatedTime}</span>
              </div>
              
              {/* Mobile: Time info as separate line */}
              <div className="sm:hidden text-xs text-gray-400 mb-4">
                <span>⏱️ {test.estimatedTime}</span>
              </div>
              
              {/* Last Taken Info - Mobile optimized */}
              <div className="text-xs text-slate-500 mb-4 sm:mb-4">
                {test.lastTaken ? (
                  <div className="space-y-1 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">📅</span>
                      <span>Last taken: {test.lastTaken}</span>
                    </div>
                    {!test.isEligible && (
                      <span className="font-semibold text-gray-700 text-xs">
                        {test.daysUntilEligible > 0 ? `Available in ${test.daysUntilEligible} days` : "Available now"}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">✨</span>
                    <span>Test not taken yet</span>
                  </div>
                )}
              </div>
              
              {/* CTA Button - Mobile optimized */}
              <Link href={`/psych-tests/${test.key}`} className="w-full">
                <button 
                  className={`w-full px-4 sm:px-6 py-3 text-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 font-semibold text-sm group-hover:-translate-y-1 active:scale-95
                  ${test.isEligible 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!test.isEligible}
                >
                  {test.isEligible ? "Start Test" : "Not Available"}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <hr className="my-8 sm:my-12 border-t border-slate-200" />
      
      {/* Info Section - Mobile optimized */}
      <section className="rounded-2xl sm:rounded-3xl bg-slate-50 p-6 sm:p-8 shadow-inner">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-xl sm:text-2xl">ℹ️</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-2">
            Why Take These Tests?
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            These psychological assessments are here to empower you with valuable insights. All responses are confidential and can serve as a starting point for deeper self-awareness and informed conversations with a healthcare professional. They are not a substitute for a diagnosis.
          </p>
        </div>
      </section>
    </div>
  );
}