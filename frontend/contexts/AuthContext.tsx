"use client";
import { getMe } from "@/actions/student";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  loading: boolean; // added loading here
  getTokens: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // loading state

  const router = useRouter();

  const getTokens = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);

        const userDetails = await getMe(storedToken);
        if (userDetails?.data?.role === "admin") {
          setIsAdmin(true);
        }
      } else {
        setIsAuthenticated(false);
        setToken(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error getting token from localStorage", error);
      setIsAuthenticated(false);
      setToken(null);
      setIsAdmin(false);
    } finally {
      setLoading(false); // mark loading done
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setToken(null);
    setIsAdmin(false);
    router.push("/login"); // Optional: push to login after logout
  }, [router]);

  useEffect(() => {
    getTokens();
  }, [getTokens]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        token,
        loading,
        getTokens,
        logout,
      }}
    >
      {/* Only render children once loading is finished */}
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
