import React, { useEffect, useState } from "react";
import { getCurrentUser, signIn, signUp } from "../actions/auth";
import { AuthContext, type User } from "./AuthContext";

function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    return JSON.parse(atob(paddedPayload));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || typeof decoded.exp !== "number") return true;
  return decoded.exp - 300 < Math.floor(Date.now() / 1000);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token || isTokenExpired(token)) {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          setUser(null);
          return;
        }
        const savedUserData = localStorage.getItem("userData");
        if (savedUserData) {
          // If stored userData exists but lacks the name (older sessions), refresh from API
          const parsed = JSON.parse(savedUserData) as Partial<User>;
          if (parsed.name) {
            setUser(parsed as User);
          } else {
            const userData = await getCurrentUser();
            const u: User = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
            };
            localStorage.setItem("userData", JSON.stringify(u));
            setUser(u);
          }
        } else {
          const userData = await getCurrentUser();
          const u: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
          };
          localStorage.setItem("userData", JSON.stringify(u));
          setUser(u);
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await signIn({ email, password });
    if (!response.token) throw new Error("Token nao recebido do servidor");
    const userData: User = {
      id: response.user?.id ?? "unknown",
      name: response.user?.name ?? "",
      email: response.user?.email ?? email,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    await signUp({ name, email, password });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const refreshUser = (userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...userData };
      localStorage.setItem("userData", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
