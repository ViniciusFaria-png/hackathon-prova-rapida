import React from "react";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", height: "100vh" }}
      >
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", height: "100vh" }}
      >
        <h2>Acesso Restrito</h2>
        <p>Você precisa fazer login para acessar esta página.</p>
      </div>
    );
  }

  return <>{children}</>;
}
