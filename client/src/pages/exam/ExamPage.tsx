import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Visibility as ViewIcon,
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
import { deleteExam, getExams } from "../../actions/exam";
import AppLayout from "../../components/layout/AppLayout";
import { paths } from "../../routes/paths";
import type { ExamFilters, IExam } from "../../types/exam";

const ITEMS_PER_PAGE = 10;

export function ExamPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ExamFilters>({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchExams();
  }, [filters]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getExams(filters);
      setExams(res.data);
      setTotal(res.total);
    } catch {
      setError("Erro ao carregar provas.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (exam: IExam) => {
    if (!window.confirm(`Excluir a prova "${exam.title}"?`)) return;
    try {
      await deleteExam(exam.id);
      fetchExams();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao excluir prova.";
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
            Minhas Provas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(paths.exams.create)}
          >
            Nova Prova
          </Button>
        </Stack>

        {/* Filters */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          <TextField
            placeholder="Buscar provas..."
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
            placeholder="Filtrar por materia"
            size="small"
            sx={{ minWidth: 180 }}
            value={filters.subject || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, subject: e.target.value, page: 1 }))
            }
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ""}
              label="Status"
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  status: (e.target.value as ExamFilters["status"]) || undefined,
                  page: 1,
                }))
              }
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="draft">Rascunho</MenuItem>
              <MenuItem value="finalized">Finalizada</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button size="small" onClick={fetchExams} sx={{ ml: 1 }}>
              Tentar novamente
            </Button>
          </Alert>
        )}

        {loading ? (
          <Box textAlign="center" py={6}>
            <CircularProgress />
          </Box>
        ) : exams.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma prova encontrada
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
        ) : (
          <>
            <Stack spacing={2}>
              {exams.map((exam) => (
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
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                          <Typography variant="subtitle1" fontWeight={600} noWrap>
                            {exam.title}
                          </Typography>
                          <Chip
                            label={exam.subject}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {exam.questions_count ?? exam.questions?.length ?? 0} questoes •{" "}
                          {new Date(exam.created_at).toLocaleDateString("pt-BR")}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Ver detalhes">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(paths.exams.details(exam.id));
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(exam);
                            }}
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
