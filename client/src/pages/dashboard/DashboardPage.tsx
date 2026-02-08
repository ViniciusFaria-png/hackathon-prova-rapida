import {
    Add as AddIcon,
    MenuBook as ExamIcon,
    Quiz as QuestionIcon,
    TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getExams } from "../../actions/exam";
import { getQuestions } from "../../actions/question";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../hooks/useAuth";
import { paths } from "../../routes/paths";
import type { IExam } from "../../types/exam";

interface DashboardStats {
  totalExams: number;
  totalQuestions: number;
  recentExams: IExam[];
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [examsRes, questionsRes] = await Promise.all([
          getExams({ limit: 5 }),
          getQuestions({ limit: 1 }),
        ]);
        setStats({
          totalExams: examsRes.total,
          totalQuestions: questionsRes.total,
          recentExams: examsRes.data,
        });
      } catch {
        setError("Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Olá, {user?.name || "Professor"}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bem-vindo ao Prova Fácil
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(paths.exams.create)}
          >
            Nova Prova
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                cursor: "pointer",
                "&:hover": { boxShadow: 4 },
                transition: "box-shadow 0.2s",
              }}
              onClick={() => navigate(paths.exams.root)}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      bgcolor: "primary.light",
                      borderRadius: 2,
                      p: 1.5,
                      display: "flex",
                    }}
                  >
                    <ExamIcon sx={{ color: "primary.dark", fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight={700}>
                      {stats?.totalExams ?? 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Provas Criadas
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                cursor: "pointer",
                "&:hover": { boxShadow: 4 },
                transition: "box-shadow 0.2s",
              }}
              onClick={() => navigate(paths.questions.root)}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      bgcolor: "secondary.light",
                      borderRadius: 2,
                      p: 1.5,
                      display: "flex",
                    }}
                  >
                    <QuestionIcon
                      sx={{ color: "secondary.dark", fontSize: 32 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight={700}>
                      {stats?.totalQuestions ?? 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Questões no Banco
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      bgcolor: "success.light",
                      borderRadius: 2,
                      p: 1.5,
                      display: "flex",
                    }}
                  >
                    <TrendingIcon sx={{ color: "success.dark", fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight={700}>
                      {stats?.recentExams?.length ?? 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Provas Recentes
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent exams */}
        <Typography variant="h6" fontWeight={600} mb={2}>
          Provas Recentes
        </Typography>
        {stats?.recentExams && stats.recentExams.length > 0 ? (
          <Stack spacing={2}>
            {stats.recentExams.map((exam) => (
              <Card
                key={exam.id}
                sx={{
                  cursor: "pointer",
                  "&:hover": { boxShadow: 3 },
                  transition: "box-shadow 0.2s",
                }}
                onClick={() => navigate(paths.exams.details(exam.id))}
              >
                <CardContent sx={{ py: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {exam.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exam.subject} • {exam.questions?.length ?? 0} questões
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(exam.created_at).toLocaleDateString("pt-BR")}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Nenhuma prova criada ainda.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(paths.exams.create)}
                sx={{ mt: 1 }}
              >
                Criar Primeira Prova
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </AppLayout>
  );
}
