"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "../ui/spinner";

type Role = "admin" | "student" | null;

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role; // if no role required, just auth check
  redirectPath?: string; // where to redirect unauthorized users
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, token, loading, isAdmin, isStudent } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) {
      setAuthorized(false);
      return;
    }

    if (!isAuthenticated || !token) {
      router.replace(redirectPath);
      setAuthorized(false);
      return;
    }

    // Role-based access control
    if (requiredRole === "admin" && !isAdmin) {
      router.replace("/dashboard"); // redirect students away from admin routes
      setAuthorized(false);
      return;
    }

    if (requiredRole === "student" && !isStudent) {
      router.replace("/admin-dashboard"); // redirect admins away from student routes
      setAuthorized(false);
      return;
    }

    setAuthorized(true);
  }, [
    loading,
    isAuthenticated,
    token,
    isAdmin,
    isStudent,
    requiredRole,
    redirectPath,
    router,
  ]);

  if (loading || !authorized) {
    return <Spinner />;
  }

  return <>{children}</>;
}
