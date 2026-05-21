import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  isAdmin: boolean;
}

export interface Session {
  access_token: string;
  user: User;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, startupName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5033";

function decodeJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("senviok_token");
      if (token) {
        const decoded = decodeJwt(token);
        if (decoded) {
          // Check expiration
          const exp = decoded.exp * 1000;
          if (Date.now() < exp) {
            const mappedUser: User = {
              id: decoded.sub || "",
              email: decoded.email || "",
              name: decoded.name || "",
              tenantId: decoded.TenantId || "",
              isAdmin: decoded.IsAdmin === "true" || decoded.role === "Admin",
            };
            setSession({ access_token: token, user: mappedUser });
            setUser(mappedUser);
          } else {
            localStorage.removeItem("senviok_token");
          }
        } else {
          localStorage.removeItem("senviok_token");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, startupName: string) => {
    try {
      const name = email.split("@")[0];
      const res = await fetch(`${API_URL}/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password, Name: name, CompanyName: startupName }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.Message || errData.message || "Failed to sign up.");
      }

      const data = await res.json();
      localStorage.setItem("senviok_token", data.token);
      
      const decoded = decodeJwt(data.token);
      const mappedUser: User = {
        id: data.userId || decoded?.sub || "",
        email: email,
        name: data.name || decoded?.name || name,
        tenantId: decoded?.TenantId || "",
        isAdmin: decoded?.IsAdmin === "true" || decoded?.role === "Admin",
      };

      setSession({ access_token: data.token, user: mappedUser });
      setUser(mappedUser);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.Message || errData.message || "Failed to log in.");
      }

      const data = await res.json();
      localStorage.setItem("senviok_token", data.token);

      const decoded = decodeJwt(data.token);
      const mappedUser: User = {
        id: data.userId || decoded?.sub || "",
        email: email,
        name: data.name || decoded?.name || "",
        tenantId: decoded?.TenantId || "",
        isAdmin: decoded?.IsAdmin === "true" || decoded?.role === "Admin",
      };

      setSession({ access_token: data.token, user: mappedUser });
      setUser(mappedUser);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("senviok_token");
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
