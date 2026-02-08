import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { paths } from "../routes/paths";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} replace />;
  }

  return <>{children}</>;
}
