"use client";

import {
  LayoutDashboard,
  TrendingUp,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Activity,
  UserCheck,
  Clock,
  Shield,
  Calendar,
  FileText,
} from "lucide-react";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageLoader from "@/components/ui/page-loader";

// Assuming your actions file is at this path, relative to the page
import {
  getStudentsCount,
  getTestAverages,
  getSessionsCount,
} from "../../../actions/admin";

interface ITestAverageData {
  phqAvg: number;
  gadAvg: number;
  pssAvg: number;
  phqCount: number;
  gadCount: number;
  pssCount: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    activeUsers: 0,
    activeSessions: 0,
    assessments: 0,
    phqAvg: 0,
    gadAvg: 0,
    pssAvg: 0,
    phqCount: 0,
    gadCount: 0,
    pssCount: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Unauthorized. Please log in as an administrator.");
        setLoading(false);
        return;
      }

      try {
        const [studentsRes, averagesRes, sessionsRes] = await Promise.all([
          getStudentsCount(token),
          getTestAverages(token),
          getSessionsCount(token),
        ]);

        if (studentsRes.ok && averagesRes.ok && sessionsRes.ok) {
          const { result, counts } = averagesRes.data || {};
          const activeSessions = sessionsRes.data.count || 0;

          // Correcting the property names to match the backend's response
          const phqAvg = result?.avgPhqScore || 0;
          const gadAvg = result?.avgGadScore || 0;
          const pssAvg = result?.avgPssScore || 0;

          const phqCount = counts?.phqCount || 0;
          const gadCount = counts?.gadCount || 0;
          const pssCount = counts?.pssCount || 0;

          setData({
            activeUsers: studentsRes.data.count,
            activeSessions: activeSessions,
            assessments: phqCount + gadCount + pssCount,
            phqAvg: phqAvg,
            gadAvg: gadAvg,
            pssAvg: pssAvg,
            phqCount: phqCount,
            gadCount: gadCount,
            pssCount: pssCount,
          });
        } else {
          setError(
            studentsRes.error ||
              averagesRes.error ||
              sessionsRes.error ||
              "Failed to load dashboard data."
          );
          toast.error(
            studentsRes.error ||
              averagesRes.error ||
              sessionsRes.error ||
              "Failed to load dashboard data."
          );
        }
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "An unexpected error occurred.");
        toast.error(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <PageLoader title="Loading dashboard insights" subtitle="Aggregating latest platform metrics..." compact />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20 text-lg">
        Error: {error}
      </div>
    );
  }

  const getProgressBarWidth = (score: number, maxScore: number) => {
    if (maxScore === 0) return "0%";
    const percentage = (score / maxScore) * 100;
    return `${Math.min(percentage, 100)}%`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="mc-section-icon">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of student mental health activity</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{/* Active Users */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white mc-lift shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{data.activeUsers}</div>
              <div className="text-blue-100 text-xs font-medium">Active Users</div>
            </div>
          </div>
          <div className="flex items-center text-blue-200 text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12 from yesterday
          </div>
        </div>

        <div className="mc-card p-5 mc-lift">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{data.activeSessions}</div>
              <div className="text-slate-400 text-xs font-medium">Active Sessions</div>
            </div>
          </div>
          <div className="flex items-center text-green-600 text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            +5 this hour
          </div>
        </div>

        <div className="mc-card p-5 mc-lift">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{data.assessments}</div>
              <div className="text-slate-400 text-xs font-medium">Assessments</div>
            </div>
          </div>
          <div className="flex items-center text-purple-600 text-xs">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            This week
          </div>
        </div>

        <div className="mc-card p-5 mc-lift">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">3</div>
              <div className="text-slate-400 text-xs font-medium">Urgent Flags</div>
            </div>
          </div>
          <div className="flex items-center text-orange-500 text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Needs attention
          </div>
        </div>
      </div>

      <div className="mc-divider"></div>

      {/* Assessment Breakdown */}
      <div className="mc-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Assessment Analytics</h2>
        </div>
        <div className="p-5 grid gap-4 md:grid-cols-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300 hover:scale-102 transform cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold text-blue-800">PHQ-9</span>
              <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                Depression
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {data.phqCount}
            </div>
            <div className="text-blue-600 text-sm">Completed this week</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300 hover:scale-102 transform cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold text-purple-800">GAD-7</span>
              <span className="bg-purple-600 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                Anxiety
              </span>
            </div>
            <div className="text-3xl font-bold text-purple-900 mb-1">
              {data.gadCount}
            </div>
            <div className="text-purple-600 text-sm">Completed this week</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300 hover:scale-102 transform cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold text-green-800">PSS</span>
              <span className="bg-green-600 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                Stress
              </span>
            </div>
            <div className="text-3xl font-bold text-green-900 mb-1">
              {data.pssCount}
            </div>
            <div className="text-green-600 text-sm">Completed this week</div>
          </div>
        </div>
      </div>

      <div className="mc-divider"></div>

      {/* Forum Monitoring - Enhanced Alert */}
      <div className="mc-card overflow-hidden border-red-100">
        <div className="px-5 py-4 border-b border-red-100 bg-red-50/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Forum Monitoring</h2>
            <div className="text-red-600 text-xs font-semibold">3 urgent items need attention</div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-red-50/70 p-4 rounded-xl border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-3">
              <span className="mc-badge-red">High Priority</span>
              <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">Flag #232</span>
            </div>
            <p className="text-slate-700 mb-3 text-sm font-medium">
              "Suicide Mention Detected" — Automated content flagging system triggered
            </p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-green-50 hover:text-green-700 border border-slate-200 hover:border-green-300 rounded-lg transition-all duration-200 text-xs font-semibold">
                <CheckCircle className="h-3.5 w-3.5" />
                Mark Resolved
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-xs font-semibold">
                <AlertTriangle className="h-3.5 w-3.5" />
                Escalate Now
              </button>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-sm font-semibold text-slate-600">
            <Eye className="h-4 w-4" />
            View All Flagged Posts
          </button>
        </div>
      </div>

      <div className="mc-divider"></div>

      {/* Weekly Trends Chart */}
      <div className="mc-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Weekly Assessment Trends</h2>
        </div>
        <div className="p-5 space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="font-medium text-slate-700 text-sm">
                  PHQ-9 (Depression)
                </span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">
                  {data.phqAvg.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">avg this week</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full relative overflow-hidden"
                style={{ width: getProgressBarWidth(data.phqAvg, 27) }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="font-medium text-slate-700 text-sm">
                  GAD-7 (Anxiety)
                </span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">
                  {data.gadAvg.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">avg this week</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-500 h-2.5 rounded-full relative overflow-hidden"
                style={{ width: getProgressBarWidth(data.gadAvg, 21) }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-medium text-slate-700 text-sm">
                  PSS (Stress)
                </span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">
                  {data.pssAvg.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500">avg this week</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full relative overflow-hidden"
                style={{ width: getProgressBarWidth(data.pssAvg, 40) }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-slate-600 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              All data is anonymized and aggregated above k-anonymity thresholds
              for privacy protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
