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
      <div className="text-center text-slate-600 mt-20 text-lg">
        Loading tests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20 text-lg">
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
    <div className="space-y-12 py-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
          Psychological Assessments
        </h1>
        <p className="mt-2 text-md text-slate-600">
          Explore a range of validated tests to better understand your mental health.
        </p>
      </header>
      
      <section className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {combinedTests.map((test) => (
            <div 
              key={test.key} 
              className="group relative rounded-3xl bg-white p-8 ring-1 ring-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div 
                className={`w-16 h-16 ${test.bgColor} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105`}
              >
                <span className="text-3xl">{test.icon}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{test.title}</h3>
              
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {test.desc}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                <span className={`font-medium ${test.isEligible ? 'text-green-600' : 'text-red-500'}`}>
                  {getStatusText(test.isEligible)}
                </span>
                <span>•</span>
                <span>{test.estimatedTime}</span>
              </div>
              
              <div className="text-xs text-slate-500 mb-4">
                {test.lastTaken ? (
                  <div className="flex justify-between items-center">
                    <span>Last taken: {test.lastTaken}</span>
                    {!test.isEligible && (
                      <span className="font-semibold text-gray-700">
                        {test.daysUntilEligible > 0 ? `Available in ${test.daysUntilEligible} days` : "Available now"}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    Test not taken yet.
                  </div>
                )}
              </div>
              
              <Link href={`/psych-tests/${test.key}`} className="w-full">
                <button 
                  className={`w-full px-6 py-3 text-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 font-semibold text-sm group-hover:-translate-y-1
                  ${test.isEligible ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-400 cursor-not-allowed'}`}
                  disabled={!test.isEligible}
                >
                  {test.isEligible ? "Start Test" : "Not Available"}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-12 border-t border-slate-200" />
      
      <section className="rounded-3xl bg-slate-50 p-8 shadow-inner">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">ℹ️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
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