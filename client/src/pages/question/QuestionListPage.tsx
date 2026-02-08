import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteQuestion, getQuestions } from "../../actions/question";
import AppLayout from "../../components/layout/AppLayout";
import { paths } from "../../routes/paths";
import type { IQuestion, QuestionFilters } from "../../types/question";

const DIFF_LABELS: Record<string, string> = {
  easy: "Facil",
  medium: "Media",
  hard: "Dificil",
};

const DIFF_COLORS: Record<string, "success" | "warning" | "error"> = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

export function QuestionListPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<QuestionFilters>({
    page: 1,
    limit: 10,
  });

  const totalPages = Math.ceil(total / 10);

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getQuestions(filters);
      setQuestions(res.data);
      setTotal(res.total);
    } catch {
      setError("Erro ao carregar questoes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (q: IQuestion) => {
    if (!window.confirm("Excluir esta questao?")) return;
    try {
      await deleteQuestion(q.id);
      fetchQuestions();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao excluir questao.";
      setError(msg);
    }
  };

  return (
    <AppLayout>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight={700}>
            Banco de Questoes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(paths.questions.create)}
          >
            Nova Questao
          </Button>
        </Stack>

        {/* Filters */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          <TextField
            placeholder="Buscar questoes..."
            size="small"
            sx={{ minWidth: 250 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
            }
          />
          <TextField
            placeholder="Materia"
            size="small"
            sx={{ minWidth: 160 }}
            value={filters.subject || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, subject: e.target.value, page: 1 }))
            }
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Dificuldade</InputLabel>
            <Select
              value={filters.difficulty || ""}
              label="Dificuldade"
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  difficulty: e.target.value || undefined,
                  page: 1,
                }))
              }
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="easy">Facil</MenuItem>
              <MenuItem value="medium">Media</MenuItem>
              <MenuItem value="hard">Dificil</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button size="small" onClick={fetchQuestions} sx={{ ml: 1 }}>
              Tentar novamente
            </Button>
          </Alert>
        )}

        {loading ? (
          <Box textAlign="center" py={6}>
            <CircularProgress />
          </Box>
        ) : questions.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma questao encontrada
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(paths.questions.create)}
                sx={{ mt: 1 }}
              >
                Criar Primeira Questao
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Stack spacing={2}>
              {questions.map((q) => (
                <Card key={q.id}>
                  <CardContent sx={{ py: 2 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {q.statement}
                        </Typography>
                        <Stack direction="row" spacing={1} mb={1}>
                          <Chip label={q.subject} size="small" color="primary" variant="outlined" />
                          <Chip
                            label={DIFF_LABELS[q.difficulty] || q.difficulty}
                            size="small"
                            color={DIFF_COLORS[q.difficulty] || "default"}
                            variant="outlined"
                          />
                          <Chip
                            label={`${q.alternatives.length} alternativas`}
                            size="small"
                            variant="outlined"
                          />
                          {q.is_public && (
                            <Chip label="Publica" size="small" color="info" variant="outlined" />
                          )}
                        </Stack>
                        <Stack spacing={0.25}>
                          {q.alternatives.map((alt, idx) => (
                            <Typography
                              key={alt.id}
                              variant="body2"
                              sx={{
                                color: alt.is_correct ? "success.main" : "text.secondary",
                                fontWeight: alt.is_correct ? 600 : 400,
                              }}
                            >
                              {String.fromCharCode(65 + idx)}) {alt.text}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => navigate(paths.questions.edit(q.id))}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(q)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={filters.page || 1}
                  onChange={(_e, page) => setFilters((f) => ({ ...f, page }))}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}
