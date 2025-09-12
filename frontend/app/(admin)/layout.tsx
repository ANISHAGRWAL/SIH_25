"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);

  const { user } = useAuth();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    console.log("Admin logout clicked");
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-blue-50 font-sans text-slate-800 flex flex-col">
        {/* Desktop header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
          {/* Left side: Logo */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Sahayog Admin</span>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex-1 flex justify-center">
            <nav className="flex items-center gap-6 text-slate-600">
              <Link
                href="/admin-dashboard"
                className="font-medium hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/users"
                className="font-medium hover:text-slate-900 transition-colors"
              >
                Users
              </Link>
              <Link
                href="/appointments"
                className="font-medium hover:text-slate-900 transition-colors"
              >
                Appointments
              </Link>
              <Link
                href="/forums"
                className="font-medium hover:text-slate-900 transition-colors"
              >
                Forums
              </Link>
            </nav>
          </div>

          {/* Right side: Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {isProfileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[60]">
                  <Link
                    href="/admin-profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Admin Profile
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Mobile header */}
        <header className="md:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left side: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-400 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Sahayog Admin
              </span>
            </div>

            {/* Right side: Profile and Menu button */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>

                {isProfileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[100]"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[110]">
                      <Link
                        href="/admin-profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Admin Profile
                      </Link>
                      <Link
                        href="/admin/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-600" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {isMobileMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/20 z-30"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg z-40">
                <nav className="px-4 py-3 space-y-1">
                  <Link
                    href="/admin-dashboard"
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/users"
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Users
                  </Link>
                  <Link
                    href="/appointments"
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Appointments
                  </Link>
                  <Link
                    href="/forums"
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Forums
                  </Link>
                </nav>
              </div>
            </>
          )}
        </header>

        {/* Main content container with dynamic margin */}
        <div className="flex-1 overflow-y-auto pt-16 md:pt-20">
          <main className="h-full">
            <div className="h-full bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-6 md:p-8 mb-20 md:mb-0">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile nav bar */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200">
          <nav className="flex items-center justify-around px-2 py-3">
            <MobileLink
              href="/admin-dashboard"
              label="Dashboard"
              isActive={pathname === "/dashboard"}
              icon={LayoutDashboard}
            />
            <MobileLink
              href="/users"
              label="Users"
              isActive={pathname === "/users"}
              icon={Users}
            />
            <MobileLink
              href="/appointments"
              label="Appointments"
              isActive={pathname === "/appointments"}
              icon={Calendar}
            />
            <MobileLink
              href="/forums"
              label="Forums"
              isActive={pathname === "/forums"}
              icon={MessageSquare}
            />
            {/* Fix applied here: Use nullish coalescing to ensure pathname is a string */}
            <MobileMoreMenu pathname={pathname ?? ""} />
          </nav>
        </footer>
      </div>
    </ProtectedRoute>
  );
}

function SideLink({
  href,
  label,
  isActive = false,
  icon: Icon,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const activeClasses =
    "bg-white text-blue-600 border border-blue-200 shadow-md";
  const inactiveClasses =
    "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900";

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
      <span className="font-bold">{label}</span>
    </Link>
  );
}

function MobileLink({
  href,
  label,
  isActive = false,
  icon: Icon,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const activeClasses = "text-blue-600";
  const inactiveClasses = "text-slate-500";

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 text-xs transition-colors ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function MobileMoreMenu({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const moreItems = [
    { href: "/admin/content", label: "Content", icon: FileText },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const isAnyMoreItemActive = moreItems.some((item) => pathname === item.href);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-col items-center gap-1 text-xs transition-colors ${
          isAnyMoreItemActive ? "text-blue-600" : "text-slate-500"
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </div>
        <span className="font-medium">More</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-48 z-50">
            {moreItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  pathname === item.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}