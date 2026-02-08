import { ArrowBack, CheckCircle as ConfirmIcon, Search as SearchIcon, Visibility } from "@mui/icons-material";
import {
    Alert,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    addQuestionsToExamBatch,
    createExam,
    getExamById,
    removeQuestionFromExam,
    updateExam,
} from "../../actions/exam";
import { getQuestions } from "../../actions/question";
import AppLayout from "../../components/layout/AppLayout";
import { paths } from "../../routes/paths";
import type { IExam } from "../../types/exam";
import type { IQuestion, QuestionFilters } from "../../types/question";

const DIFF_LABELS: Record<string, string> = {
  easy: "Facil",
  medium: "Media",
  hard: "Dificil",
};

export function ExamCreateEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exam, setExam] = useState<IExam | null>(null);

  // Question bank
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [qFilters, setQFilters] = useState<QuestionFilters>({
    page: 1,
    limit: 10,
  });
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(
    new Set(),
  );
  const [pendingAdditions, setPendingAdditions] = useState<Set<string>>(new Set());
  const [pendingRemovals, setPendingRemovals] = useState<Set<string>>(new Set());
  const [batchSaving, setBatchSaving] = useState(false);
  const [viewingQuestion, setViewingQuestion] = useState<IQuestion | null>(null);

  useEffect(() => {
    if (id) {
      loadExam();
    }
  }, [id]);

  useEffect(() => {
    if (isEditing && exam) {
      fetchQuestions();
    }
  }, [qFilters, exam]);

  const loadExam = async () => {
    try {
      const data = await getExamById(id!);
      setExam(data);
      setTitle(data.title);
      setSubject(data.subject);
      setSelectedQuestionIds(new Set(data.questions.map((q) => q.id)));
      setPendingAdditions(new Set());
      setPendingRemovals(new Set());
    } catch {
      setError("Erro ao carregar prova.");
    }
  };

  const fetchQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const res = await getQuestions(qFilters);
      setQuestions(res.data);
      setTotalQuestions(res.total);
    } catch {
      setError("Erro ao carregar questoes.");
    } finally {
      setQuestionsLoading(false);
    }
  };

  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim() || !subject.trim()) {
      setError("Titulo e materia sao obrigatorios.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      if (isEditing) {
        const response = await updateExam(id!, { title, subject });
        console.log('RESPOSTA COMPLETA AO SALVAR:', response);
        navigate(paths.exams.details(id!));
      } else {
        const result = await createExam({ title, subject });
        console.log('RESPOSTA COMPLETA AO CRIAR:', result);
        navigate(paths.exams.details(result.id));
      }
    } catch (err: any) {
      console.error('ERRO AO SALVAR PROVA:', err?.response?.status, err?.response?.data);
      setError(err?.response?.data?.message || "Erro ao salvar prova.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleQuestion = useCallback((questionId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!id) return;

    const isCurrentlyInExam = selectedQuestionIds.has(questionId) && !pendingRemovals.has(questionId);
    const isPendingAdd = pendingAdditions.has(questionId);

    if (isCurrentlyInExam || isPendingAdd) {
      // User wants to remove
      if (isPendingAdd) {
        // Was pending addition — just undo the pending add
        setPendingAdditions((prev) => {
          const next = new Set(prev);
          next.delete(questionId);
          return next;
        });
      } else {
        // Already persisted — mark for removal
        setPendingRemovals((prev) => new Set(prev).add(questionId));
      }
    } else if (pendingRemovals.has(questionId)) {
      // Was pending removal — undo
      setPendingRemovals((prev) => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    } else {
      // New addition
      setPendingAdditions((prev) => new Set(prev).add(questionId));
    }
  }, [id, selectedQuestionIds, pendingAdditions, pendingRemovals]);

  const isQuestionSelected = useCallback((questionId: string): boolean => {
    if (pendingRemovals.has(questionId)) return false;
    if (pendingAdditions.has(questionId)) return true;
    return selectedQuestionIds.has(questionId);
  }, [selectedQuestionIds, pendingAdditions, pendingRemovals]);

  const pendingChangesCount = pendingAdditions.size + pendingRemovals.size;

  const handleConfirmBatch = async () => {
    if (!id) return;
    try {
      setBatchSaving(true);
      setError(null);
      setSuccess(null);

      // Process removals
      for (const questionId of pendingRemovals) {
        await removeQuestionFromExam(id, questionId);
      }

      // Process additions in batch
      if (pendingAdditions.size > 0) {
        const basePosition = selectedQuestionIds.size - pendingRemovals.size;
        const questionsToAdd = Array.from(pendingAdditions).map((qId, idx) => ({
          questionId: qId,
          position: basePosition + idx + 1,
        }));
        await addQuestionsToExamBatch(id, questionsToAdd);
      }

      setSuccess(`${pendingAdditions.size} adicionada(s), ${pendingRemovals.size} removida(s) com sucesso!`);
      setPendingAdditions(new Set());
      setPendingRemovals(new Set());
      await loadExam();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao confirmar alterações.");
    } finally {
      setBatchSaving(false);
    }
  };

  return (
    <AppLayout>
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(isEditing ? paths.exams.details(id!) : paths.exams.root)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>

        <Typography variant="h4" fontWeight={700} mb={3}>
          {isEditing ? "Editar Prova" : "Criar Nova Prova"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Form */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2.5}>
              <TextField
                label="Titulo da Prova"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="Materia"
                fullWidth
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate(paths.exams.root)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <CircularProgress size={20} />
                  ) : isEditing ? (
                    "Salvar Alteracoes"
                  ) : (
                    "Criar Prova"
                  )}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Question bank - only when editing */}
        {isEditing && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" fontWeight={600} mb={2}>
              Banco de Questoes
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Selecione questoes para adicionar a prova. Questoes ja adicionadas
              estao marcadas.
            </Typography>

            {pendingChangesCount > 0 && (
              <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <Badge badgeContent={pendingChangesCount} color="primary">
                  <Chip
                    label={`${pendingAdditions.size} a adicionar, ${pendingRemovals.size} a remover`}
                    color="info"
                    variant="outlined"
                  />
                </Badge>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={batchSaving ? <CircularProgress size={16} /> : <ConfirmIcon />}
                  onClick={handleConfirmBatch}
                  disabled={batchSaving}
                >
                  {batchSaving ? "Salvando..." : "Confirmar Alterações"}
                </Button>
              </Stack>
            )}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
              <TextField
                placeholder="Buscar questoes..."
                size="small"
                sx={{ minWidth: 220 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                value={qFilters.search || ""}
                onChange={(e) =>
                  setQFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
                }
              />
              <TextField
                placeholder="Materia"
                size="small"
                sx={{ minWidth: 150 }}
                value={qFilters.subject || ""}
                onChange={(e) =>
                  setQFilters((f) => ({ ...f, subject: e.target.value, page: 1 }))
                }
              />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Dificuldade</InputLabel>
                <Select
                  value={qFilters.difficulty || ""}
                  label="Dificuldade"
                  onChange={(e) =>
                    setQFilters((f) => ({
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

            {questionsLoading ? (
              <Box textAlign="center" py={4}>
                <CircularProgress />
              </Box>
            ) : questions.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">
                    Nenhuma questao encontrada.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(paths.questions.create)}
                    sx={{ mt: 1 }}
                  >
                    Criar Nova Questao
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Stack spacing={1.5}>
                  {questions.map((q) => (
                      <Card
                        key={q.id}
                        variant="outlined"
                        sx={{
                          borderColor: isQuestionSelected(q.id) ? "primary.main" : "divider",
                          bgcolor: isQuestionSelected(q.id) ? "primary.main" + "08" : "transparent",
                        }}
                      >
                        <CardContent sx={{ py: 1.5 }}>
                          <Stack direction="row" alignItems="flex-start" spacing={1}>
                            <Checkbox
                              checked={isQuestionSelected(q.id)}
                              size="small"
                              sx={{ mt: -0.5 }}
                              onClick={(e) => handleToggleQuestion(q.id, e)}
                            />
                            <Box
                              sx={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                              onClick={(e) => handleToggleQuestion(q.id, e)}
                            >
                              <Typography variant="body1" noWrap>
                                {q.statement}
                              </Typography>
                              <Stack direction="row" spacing={1} mt={0.5}>
                                <Chip
                                  label={q.subject}
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  label={DIFF_LABELS[q.difficulty] || q.difficulty}
                                  size="small"
                                  color={
                                    q.difficulty === "easy"
                                      ? "success"
                                      : q.difficulty === "hard"
                                        ? "error"
                                        : "warning"
                                  }
                                  variant="outlined"
                                />
                                <Chip
                                  label={`${q.alternatives.length} alternativas`}
                                  size="small"
                                  variant="outlined"
                                />
                              </Stack>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingQuestion(q);
                              }}
                              title="Ver detalhes"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Stack>
                        </CardContent>
                      </Card>
                  ))}
                </Stack>

                {Math.ceil(totalQuestions / 10) > 1 && (
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                      count={Math.ceil(totalQuestions / 10)}
                      page={qFilters.page || 1}
                      onChange={(_e, page) =>
                        setQFilters((f) => ({ ...f, page }))
                      }
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}

        {/* Question Details Dialog */}
        <Dialog
          open={Boolean(viewingQuestion)}
          onClose={() => setViewingQuestion(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">Detalhes da Questão</Typography>
          </DialogTitle>
          <DialogContent>
            {viewingQuestion && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                    Enunciado:
                  </Typography>
                  <Typography variant="body1">{viewingQuestion.statement}</Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Chip label={viewingQuestion.subject} size="small" />
                  <Chip
                    label={DIFF_LABELS[viewingQuestion.difficulty] || viewingQuestion.difficulty}
                    size="small"
                    color={
                      viewingQuestion.difficulty === "easy"
                        ? "success"
                        : viewingQuestion.difficulty === "hard"
                          ? "error"
                          : "warning"
                    }
                  />
                  {viewingQuestion.is_public && (
                    <Chip label="Pública" size="small" color="info" />
                  )}
                </Stack>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" mb={1}>
                    Alternativas:
                  </Typography>
                  <Stack spacing={1}>
                    {viewingQuestion.alternatives.map((alt, idx) => (
                      <Box
                        key={alt.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: alt.is_correct ? "success.main" + "15" : "grey.100",
                          border: 1,
                          borderColor: alt.is_correct ? "success.main" : "divider",
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ minWidth: 24 }}
                          >
                            {String.fromCharCode(65 + idx)})
                          </Typography>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {alt.text}
                          </Typography>
                          {alt.is_correct && (
                            <Chip
                              label="Correta"
                              size="small"
                              color="success"
                              sx={{ height: 20 }}
                            />
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
                  <Button onClick={() => setViewingQuestion(null)}>Fechar</Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleToggleQuestion(viewingQuestion.id);
                      setViewingQuestion(null);
                    }}
                  >
                    {isQuestionSelected(viewingQuestion.id) ? "Remover" : "Adicionar"}
                  </Button>
                </Stack>
              </Stack>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </AppLayout>
  );
}
