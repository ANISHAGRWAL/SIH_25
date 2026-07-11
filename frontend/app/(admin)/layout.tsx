"use client";

import Image from "next/image";
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
  Shield, // Icon for Volunteers
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] =
    React.useState(false);

  const { user } = useAuth();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    console.log("Admin logout clicked");
  };

  // Helper function to get user initials
  const getUserInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Profile Avatar Component
  const ProfileAvatar = ({ size = "w-10 h-10" }: { size?: string }) => {
    const initials = getUserInitials(user?.name);
    
    return (
      <div className={`${size} rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 text-white flex items-center justify-center font-semibold text-sm shadow-lg overflow-hidden`}>
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
        {!user?.avatarUrl && (
          <span className="text-white font-semibold">
            {initials}
          </span>
        )}
      </div>
    );
  };

  const navLinks = [
    { href: "/admin-dashboard", label: "Dashboard" },
    { href: "/users",           label: "Users" },
    { href: "/volunteers",      label: "Volunteers" },
    { href: "/appointments",    label: "Appointments" },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen text-slate-800 flex flex-col page-fade-in">
        {/* Desktop header */}
        <header className="hidden md:flex items-center justify-between px-6 py-2.5 mental-surface fixed top-2 left-3 right-3 z-50">
          {/* Left side: Logo */}
          <Image
            src="/logoiconfull.png"
            alt="CampusCare logo"
            width={90}
            height={90}
          />

          {/* Center: Navigation Links */}
          <div className="flex-1 flex justify-center">
            <nav className="flex items-center gap-1">
              {navLinks.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={active ? "mental-nav-link-active" : "mental-nav-link"}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side: Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="hover:scale-105 transition-all duration-200 hover:shadow-xl hover:rounded-b-full transform hover:-translate-y-0.5"
            >
              <ProfileAvatar />
            </button>

            {isProfileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileDropdownOpen(false)}
                />
                 <div className="absolute right-0 top-full mt-2 w-48 mental-surface py-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
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
        <header className="md:hidden mental-surface fixed top-2 left-2 right-2 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left side: Logo */}
            <Image
              src="/logoiconfull.png"
              alt="CampusCare log"
              width={102}
              height={102}
            />

            {/* Right side: Profile and Menu button */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="hover:scale-105 transition-all duration-200 hover:shadow-xl"
                >
                  <ProfileAvatar />
                </button>

                {isProfileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[100]"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                     <div className="absolute right-0 top-full mt-2 w-44 mental-surface py-2 z-[110] animate-in fade-in zoom-in-95 duration-200">
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
                        Profile
                      </Link>
                      <Link
                        href="/settings"
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
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          auth.logout();
                          console.log("Sign out clicked");
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
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
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
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
               <div className="absolute top-full left-0 right-0 mental-surface z-40 animate-in slide-in-from-top-2 duration-200">
                <nav className="px-4 py-3 space-y-1">
                  {navLinks.map(({ href, label }) => {
                    const active = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {label}
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </>
          )}
        </header>

        {/* Main content container with dynamic margin */}
        <div className="flex-1 overflow-y-auto pt-16 md:pt-20">
          <main className="h-full">
            <div className="h-full mental-shell p-4 md:p-6 mb-20 md:mb-0 page-fade-in">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile nav bar */}
        <footer className="fixed bottom-2 left-2 right-2 z-50 md:hidden mental-surface">
          <nav className="flex items-center justify-around px-2 py-2">
            <MobileLink
              href="/admin-dashboard"
              label="Dashboard"
              isActive={pathname === "/admin-dashboard"}
              icon={LayoutDashboard}
            />
            <MobileLink
              href="/users"
              label="Users"
              isActive={pathname === "/users"}
              icon={Users}
            />
            <MobileLink
              href="/volunteers"
              label="Volunteers"
              isActive={pathname === "/volunteers"}
              icon={Shield}
            />
            <MobileLink
              href="/appointments"
              label="Appointments"
              isActive={pathname === "/appointments"}
              icon={Calendar}
            />
          </nav>
        </footer>
      </div>
    </ProtectedRoute>
  );
}

// SideLink component remains unchanged as it is not used in the layout
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
      <Icon
        className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-500"}`}
      />
      <span className="font-bold">{label}</span>
    </Link>
  );
}

// MobileLink component
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
  return (
    <Link
      href={href}
      className={`mobile-nav-item ${isActive ? "mobile-nav-item-active" : ""}`}
    >
      <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${isActive ? "bg-blue-100" : ""}`}>
        <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
      </div>
      <span>{label}</span>
    </Link>
  );
}

// Note: MobileMoreMenu component is no longer used in the layout,
// but is kept here in case you want to re-add it.
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
