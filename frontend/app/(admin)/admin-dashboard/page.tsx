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

export default function AdminDashboard() {
  return (
<div className="space-y-4 lg:space-y-6 max-w-7xl mx-auto">      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-lg flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          Dashboard
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <UserCheck className="h-7 w-7 opacity-80" />
            <div className="text-right">
              <div className="text-2xl font-bold">354</div>
              <div className="text-blue-100 text-sm">Active Users</div>
            </div>
          </div>
          <div className="flex items-center text-blue-200">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">+12 from yesterday</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-7 w-7 text-green-500" />
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">28</div>
              <div className="text-slate-500 text-sm">Active Sessions</div>
            </div>
          </div>
          <div className="flex items-center text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">+5 this hour</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <FileText className="h-7 w-7 text-purple-500" />
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">381</div>
              <div className="text-slate-500 text-sm">Assessments</div>
            </div>
          </div>
          <div className="flex items-center text-purple-600">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span className="text-sm">This week</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <Shield className="h-7 w-7 text-orange-500" />
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">3</div>
              <div className="text-slate-500 text-sm">Urgent Flags</div>
            </div>
          </div>
          <div className="flex items-center text-orange-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-sm">Needs attention</span>
          </div>
        </div>
      </div>

      ---

      {/* Assessment Breakdown */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 p-5">
          <h2 className="text-lg font-bold text-slate-900">
            Assessment Analytics
          </h2>
        </div>
        <div className="p-5 grid gap-4 md:grid-cols-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300 hover:scale-102 transform cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold text-blue-800">PHQ-9</span>
              <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                Depression
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-1">127</div>
            <div className="text-blue-600 text-sm">Completed this week</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300 hover:scale-102 transform cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold text-purple-800">GAD-7</span>
              <span className="bg-purple-600 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                Anxiety
              </span>
            </div>
            <div className="text-3xl font-bold text-purple-900 mb-1">98</div>
            <div className="text-purple-600 text-sm">Completed this week</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300 hover:scale-102 transform cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold text-green-800">PSS</span>
              <span className="bg-green-600 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                Stress
              </span>
            </div>
            <div className="text-3xl font-bold text-green-900 mb-1">156</div>
            <div className="text-green-600 text-sm">Completed this week</div>
          </div>
        </div>
      </div>

      ---

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appointments Management */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-teal-50 border-b border-gray-200 p-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              Appointments
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              {
                icon: Eye,
                label: "View by Counselor",
                color: "text-blue-500",
              },
              {
                icon: Calendar,
                label: "Set Availability",
                color: "text-green-500",
              },
              {
                icon: AlertTriangle,
                label: "See Missed Sessions",
                color: "text-orange-500",
              },
            ].map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-start space-x-3 px-4 py-2.5 bg-white/60 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
              >
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-slate-700 font-medium">{item.label}</span>
              </button>
            ))}
            <button className="w-full flex items-center justify-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 font-semibold">
              <Download className="h-4 w-4" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* Assessment Analytics */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-gray-200 p-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Analytics Tools
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              {
                icon: TrendingUp,
                label: "Heatmap View",
                color: "text-purple-500",
              },
              {
                icon: ArrowUpRight,
                label: "Trend Analysis",
                color: "text-blue-500",
              },
            ].map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-start space-x-3 px-4 py-2.5 bg-white/60 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
              >
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-slate-700 font-medium">{item.label}</span>
              </button>
            ))}
            <button className="w-full flex items-center justify-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 font-semibold">
              <Download className="h-4 w-4" />
              <span>Export Analytics</span>
            </button>
          </div>
        </div>
      </div>

      ---

      {/* Forum Monitoring - Enhanced Alert */}
      <div className="bg-white/80 backdrop-blur-sm border border-red-200 shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200 p-5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Forum Monitoring
              </h2>
              <div className="text-red-600 text-sm font-medium">
                3 urgent items need attention
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-xl border-l-4 border-red-500 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                High Priority
              </span>
              <span className="text-xs text-slate-500 bg-white px-2.5 py-0.5 rounded-full">
                Flag #232
              </span>
            </div>
            <p className="text-slate-700 mb-3 text-sm font-medium">
              "Suicide Mention Detected" - Automated content flagging system triggered
            </p>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-white hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-300 rounded-lg transition-all duration-200 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                <span>Mark Resolved</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                <span>Escalate Now</span>
              </button>
            </div>
          </div>
          <button className="w-full flex items-center justify-center space-x-3 px-4 py-2.5 bg-white/60 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 hover:shadow-sm font-medium">
            <Eye className="h-4 w-4 text-slate-600" />
            <span className="text-slate-700 text-sm">View All Flagged Posts</span>
          </button>
        </div>
      </div>

      ---

      {/* Weekly Trends Chart */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 p-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Weekly Assessment Trends
          </h2>
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
                <div className="text-xl font-bold text-slate-900">7.0</div>
                <div className="text-xs text-slate-500">avg this week</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full relative overflow-hidden"
                style={{ width: "70%" }}
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
                <div className="text-xl font-bold text-slate-900">5.5</div>
                <div className="text-xs text-slate-500">avg this week</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-500 h-2.5 rounded-full relative overflow-hidden"
                style={{ width: "55%" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-medium text-slate-700 text-sm">PSS (Stress)</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">9.8</div>
                <div className="text-xs text-slate-500">avg this week</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full relative overflow-hidden"
                style={{ width: "98%" }}
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