import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { paths } from "../../routes/paths";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(paths.dashboard);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Email ou senha incorretos.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 420,
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
            Prova Rápida
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Faça login para acessar o sistema
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "Entrar"}
            </Button>
          </Stack>
        </form>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            Não tem uma conta?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate(paths.auth.register)}
              sx={{ cursor: "pointer" }}
            >
              Criar conta
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
