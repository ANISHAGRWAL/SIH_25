"use client";
import { getMe } from "@/actions/student";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  getTokens: () => void;
  getToken: () => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setToken(null);
    setIsAdmin(false);
    setIsStudent(false);
    setUser(null);
    // router.push("/login");
  }, [router]);

  const getTokens = useCallback(async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      logout();
      setLoading(false);
      return;
    }

    try {
      const userDetails = await getMe(storedToken);

      if (!userDetails?.data || userDetails?.error) {
        logout();
        throw new Error("Failed to fetch user details");
      }
      setToken(storedToken);
      setIsAuthenticated(true);
      setUser(userDetails?.data || null);

      const role = userDetails?.data?.role;
      if (role === "admin") {
        setIsAdmin(true);
        setIsStudent(false);
      } else {
        setIsAdmin(false);
        setIsStudent(true);
      }
    } catch (error: any) {
      console.error("Token invalid or expired", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const getToken = useCallback(() => {
    return token;
  }, [token]);

  useEffect(() => {
    getTokens();
  }, [getTokens]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        isStudent,
        token,
        user,
        loading,
        getTokens,
        getToken,
        logout,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
