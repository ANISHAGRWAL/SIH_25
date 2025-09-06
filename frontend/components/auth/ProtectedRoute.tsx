"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !token)) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, token, router]);

  if (loading || (!isAuthenticated && !token)) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
