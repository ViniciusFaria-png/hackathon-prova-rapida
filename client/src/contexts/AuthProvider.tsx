import React, { useEffect, useState } from "react";
import { signIn } from "../actions/auth";
import { AuthContext, type DecodedToken, type User } from "./AuthContext";

function decodeJWT(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Token JWT inválido");

    const payload = parts[1];
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    return JSON.parse(atob(paddedPayload));
  } catch (error) {
    console.error("❌ Erro ao decodificar JWT:", error);
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const bufferTime = 5 * 60; // 5 min
  return decoded.exp - bufferTime < currentTime;
}

function createUserFromToken(decoded: DecodedToken, email: string): User {
  return {
    id: String(decoded.sub || decoded.id || decoded.userId || "unknown"),
    email: decoded.email || email,
    professorName: decoded.professorName || decoded.professor_name,
    isProfessor: Boolean(decoded.isProfessor || decoded.is_professor),
    professorId: decoded.professorId || decoded.professor_id,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const savedUserData = localStorage.getItem("userData");

        if (!token || isTokenExpired(token)) {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          setUser(null);
          return;
        }

        if (savedUserData) {
          setUser(JSON.parse(savedUserData));
        } else {
          const decoded = decodeJWT(token);
          if (decoded) {
            const userData = createUserFromToken(decoded, "");
            setUser(userData);
            localStorage.setItem("userData", JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error("❌ Erro na verificação de autenticação:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, senha: string) => {
    const response = await signIn({ email, senha });
    if (!response.token) throw new Error("Token não recebido do servidor");

    if (isTokenExpired(response.token)) throw new Error("Token expirado");

    let userData: User;
    if (response.user) {
      const decoded = decodeJWT(response.token);
      userData = {
        id: String(response.user.id || response.user.sub || "unknown"),
        email: response.user.email || email,
        professorName: response.user.professorName,
        isProfessor: Boolean(response.user.isProfessor),
        professorId:
          response.user.professorId ||
          (decoded ? decoded.professorId : undefined),
      };
    } else {
      const decoded = decodeJWT(response.token);
      if (!decoded) throw new Error("Não foi possível decodificar o token");
      userData = createUserFromToken(decoded, email);
    }

    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
