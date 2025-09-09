"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  TrendingUp,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  Activity,
  UserCheck,
  Clock,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "content", label: "Content", icon: FileText },
  { id: "forums", label: "Forums", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    console.log("Logout clicked");
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Unified Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="font-bold text-xl text-slate-900">
                  MindMates Admin
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                      hover:shadow-md hover:-translate-y-0.5 transform
                      ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-blue-500 to-indigo-400 text-white shadow-lg"
                          : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Side - Date and Logout */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-sm text-slate-500 bg-gray-100 px-3 py-2 rounded-lg">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 text-sm font-semibold"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden hover:bg-blue-100 rounded-xl p-2 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`lg:hidden mt-4 transition-all duration-300 ${
              mobileMenuOpen
                ? "opacity-100 max-h-96"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="space-y-2 pb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                      ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-blue-500 to-indigo-400 text-white shadow-lg"
                          : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="text-sm text-slate-500 bg-gray-100 px-3 py-2 rounded-lg">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-400 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            {navItems.find((item) => item.id === activeSection)?.label ||
              "Dashboard"}
          </h1>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {activeSection === "dashboard" && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <UserCheck className="h-8 w-8 opacity-80" />
                    <div className="text-right">
                      <div className="text-3xl font-bold">354</div>
                      <div className="text-blue-100 text-sm">Active Users</div>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+12 from yesterday</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="h-8 w-8 text-green-500" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-900">
                        28
                      </div>
                      <div className="text-slate-500 text-sm">
                        Active Sessions
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">+5 this hour</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FileText className="h-8 w-8 text-purple-500" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-900">
                        381
                      </div>
                      <div className="text-slate-500 text-sm">Assessments</div>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-sm">This week</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="h-8 w-8 text-orange-500" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-900">3</div>
                      <div className="text-slate-500 text-sm">Urgent Flags</div>
                    </div>
                  </div>
                  <div className="flex items-center text-orange-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Needs attention</span>
                  </div>
                </div>
              </div>

              {/* Assessment Breakdown */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Assessment Analytics
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-md transition-all duration-300 hover:scale-102 transform cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-blue-800">
                          PHQ-9
                        </span>
                        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                          Depression
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-blue-900 mb-2">
                        127
                      </div>
                      <div className="text-blue-600 text-sm">
                        Completed this week
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-md transition-all duration-300 hover:scale-102 transform cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-purple-800">
                          GAD-7
                        </span>
                        <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                          Anxiety
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-purple-900 mb-2">
                        98
                      </div>
                      <div className="text-purple-600 text-sm">
                        Completed this week
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-md transition-all duration-300 hover:scale-102 transform cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-green-800">
                          PSS
                        </span>
                        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                          Stress
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-green-900 mb-2">
                        156
                      </div>
                      <div className="text-green-600 text-sm">
                        Completed this week
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Appointments Management */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-teal-50 border-b border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-teal-600" />
                      Appointments
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
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
                        className="w-full flex items-center justify-start space-x-3 px-4 py-3 bg-white/60 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                      >
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-slate-700 font-medium">
                          {item.label}
                        </span>
                      </button>
                    ))}
                    <button className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 font-semibold">
                      <Download className="h-4 w-4" />
                      <span>Export PDF Report</span>
                    </button>
                  </div>
                </div>

                {/* Assessment Analytics */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      Analytics Tools
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
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
                        className="w-full flex items-center justify-start space-x-3 px-4 py-3 bg-white/60 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                      >
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-slate-700 font-medium">
                          {item.label}
                        </span>
                      </button>
                    ))}
                    <button className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 font-semibold">
                      <Download className="h-4 w-4" />
                      <span>Export Analytics</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Forum Monitoring - Enhanced Alert */}
              <div className="bg-white/80 backdrop-blur-sm border border-red-200 shadow-lg rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Forum Monitoring
                      </h2>
                      <div className="text-red-600 text-sm font-medium">
                        3 urgent items need attention
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border-l-4 border-red-500 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        High Priority
                      </span>
                      <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full">
                        Flag #232
                      </span>
                    </div>
                    <p className="text-slate-700 mb-4 font-medium">
                      "Suicide Mention Detected" - Automated content flagging
                      system triggered
                    </p>
                    <div className="flex space-x-3">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-300 rounded-xl transition-all duration-200 font-medium">
                        <CheckCircle className="h-4 w-4" />
                        <span>Mark Resolved</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 font-medium">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Escalate Now</span>
                      </button>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white/60 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 hover:shadow-md font-medium">
                    <Eye className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-700">
                      View All Flagged Posts
                    </span>
                  </button>
                </div>
              </div>

              {/* Weekly Trends Chart */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Weekly Assessment Trends
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="font-medium text-slate-700">
                          PHQ-9 (Depression)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          7.0
                        </div>
                        <div className="text-sm text-slate-500">
                          avg this week
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full relative overflow-hidden"
                        style={{ width: "70%" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className="font-medium text-slate-700">
                          GAD-7 (Anxiety)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          5.5
                        </div>
                        <div className="text-sm text-slate-500">
                          avg this week
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full relative overflow-hidden"
                        style={{ width: "55%" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="font-medium text-slate-700">
                          PSS (Stress)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          9.8
                        </div>
                        <div className="text-sm text-slate-500">
                          avg this week
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full relative overflow-hidden"
                        style={{ width: "98%" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      All data is anonymized and aggregated above k-anonymity
                      thresholds for privacy protection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Settings */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    Quick Settings
                  </h2>
                </div>
                <div className="p-6">
                  <button className="w-full flex items-center justify-start space-x-3 px-4 py-3 bg-white/60 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span className="text-slate-700 font-medium">
                      Manage Admin Accounts
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Placeholder for other sections */}
          {activeSection !== "dashboard" && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {navItems.find((item) => item.id === activeSection)?.label}{" "}
                  Section
                </h2>
              </div>
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-slate-600 text-lg">
                  This section is under development. Content for {activeSection}{" "}
                  will be available soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
