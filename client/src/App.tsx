import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import "./App.css";
import { AuthProvider } from "./contexts/AuthProvider";
import { ProtectedRoute } from "./contexts/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { ExamCreateEditPage } from "./pages/exam/ExamCreateEditPage";
import { ExamDetailPage } from "./pages/exam/ExamDetailPage";
import { ExamPage } from "./pages/exam/ExamPage";
import { QuestionCreateEditPage } from "./pages/question/QuestionCreateEditPage";
import { QuestionListPage } from "./pages/question/QuestionListPage";
import ProfilePage from "./pages/user/ProfilePage";
import { paths } from "./routes/paths";
import { theme } from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Toaster position="top-right" richColors />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path={paths.auth.login} element={<LoginPage />} />
            <Route path={paths.auth.register} element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path={paths.dashboard}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={paths.profile}
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={paths.exams.root}
              element={
                <ProtectedRoute>
                  <ExamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={paths.exams.create}
              element={
                <ProtectedRoute>
                  <ExamCreateEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={paths.exams.details(":id")}
              element={
                <ProtectedRoute>
                  <ExamDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={paths.exams.edit(":id")}
              element={
                <ProtectedRoute>
                  <ExamCreateEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={paths.questions.root}
              element={
                <ProtectedRoute>
                  <QuestionListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={paths.questions.create}
              element={
                <ProtectedRoute>
                  <QuestionCreateEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={paths.questions.edit(":id")}
              element={
                <ProtectedRoute>
                  <QuestionCreateEditPage />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route
              path="/"
              element={<Navigate to={paths.dashboard} replace />}
            />
            <Route
              path="*"
              element={<Navigate to={paths.dashboard} replace />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
