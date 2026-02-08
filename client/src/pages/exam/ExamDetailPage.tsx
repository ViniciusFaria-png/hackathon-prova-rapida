import {
    ArrowBack,
    Delete as DeleteIcon,
    ContentCopy as DuplicateIcon,
    Edit as EditIcon,
    PictureAsPdf as PdfIcon,
    Preview as PreviewIcon,
    Shuffle as ShuffleIcon,
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    deleteExam,
    duplicateExam,
    exportAnswerKeyPdf,
    exportExamPdf,
    generateExamVersions,
    getExamById,
    getExamPreview,
    previewExamPdf,
    removeQuestionFromExam,
    type PdfEcoMode,
} from "../../actions/exam";
import ExportPdfDialog from "../../components/ExportPdfDialog";
import AppLayout from "../../components/layout/AppLayout";
import { paths } from "../../routes/paths";
import type { ExamPreview, IExam, IExamVersion } from "../../types/exam";

export function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<IExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [preview, setPreview] = useState<ExamPreview | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [versionsOpen, setVersionsOpen] = useState(false);
  const [versionsCount, setVersionsCount] = useState(2);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [versions, setVersions] = useState<IExamVersion[]>([]);

  useEffect(() => {
    if (id) fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExamById(id!);
      setExam(data);
      if (data.versions && data.versions.length > 0) {
        setVersions(data.versions);
      }
    } catch {
      setError("Erro ao carregar prova.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    try {
      setPreviewLoading(true);
      const data = await getExamPreview(id!);
      setPreview(data);
      setPreviewOpen(true);
    } catch {
      setError("Erro ao gerar preview.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePreviewPdf = async (ecoMode: PdfEcoMode, versionId?: string) => {
    try {
      setPdfLoading(true);
      setError(null);
      await previewExamPdf(id!, { ecoMode, versionId });
    } catch (err: any) {
      console.error("Erro ao visualizar PDF:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Erro ao visualizar PDF. Verifique se a prova tem quest\u00f5es.";
      setError(errorMsg);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleExportPdf = async (ecoMode: PdfEcoMode, isAnswerKey: boolean, versionId?: string) => {
    try {
      setPdfLoading(true);
      setError(null);
      if (isAnswerKey) {
        await exportAnswerKeyPdf(id!, { ecoMode, versionId });
      } else {
        await exportExamPdf(id!, { ecoMode, versionId });
      }
      setPdfOpen(false);
    } catch (err: any) {
      console.error("Erro ao exportar PDF:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Erro ao exportar PDF. Verifique se a prova tem questões.";
      setError(errorMsg);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const result = await duplicateExam(id!);
      navigate(paths.exams.details(result.id));
    } catch {
      setError("Erro ao duplicar prova.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Excluir esta prova permanentemente?")) return;
    try {
      await deleteExam(id!);
      navigate(paths.exams.root);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao excluir prova.";
      setError(msg);
    }
  };

  const handleRemoveQuestion = async (questionId: string) => {
    if (!window.confirm("Remover esta questao da prova?")) return;
    try {
      await removeQuestionFromExam(id!, questionId);
      fetchExam();
    } catch {
      setError("Erro ao remover questao.");
    }
  };

  const handleGenerateVersions = async () => {
    try {
      setVersionsLoading(true);
      const data = await generateExamVersions(id!, versionsCount);
      setVersions(data);
      setVersionsOpen(false);
      // Reload exam to get updated finalized status
      fetchExam();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro ao gerar versoes embaralhadas.";
      setError(msg);
    } finally {
      setVersionsLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Box textAlign="center" py={10}>
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  if (error && !exam) {
    return (
      <AppLayout>
        <Alert severity="error">{error}</Alert>
      </AppLayout>
    );
  }

  if (!exam) return null;

  return (
    <AppLayout>
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(paths.exams.root)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Header */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ sm: "center" }}
              spacing={2}
            >
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {exam.title}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Chip label={exam.subject} color="primary" />
                  <Chip
                    label={`${exam.questions?.length ?? 0} questoes`}
                    variant="outlined"
                  />
                  {exam.is_finalized && (
                    <Chip label="Finalizada" color="success" variant="filled" />
                  )}
                </Stack>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Tooltip title="Preview">
                  <IconButton onClick={handlePreview} disabled={previewLoading}>
                    {previewLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <PreviewIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Exportar PDF">
                  <IconButton onClick={() => setPdfOpen(true)}>
                    <PdfIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Gerar versoes embaralhadas">
                  <IconButton onClick={() => setVersionsOpen(true)}>
                    <ShuffleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Duplicar">
                  <IconButton onClick={handleDuplicate}>
                    <DuplicateIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={exam.is_finalized ? "Prova finalizada - não pode editar" : "Editar"}>
                  <span>
                    <IconButton
                      onClick={() => navigate(paths.exams.edit(id!))}
                      disabled={exam.is_finalized}
                    >
                      <EditIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton color="error" onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Versions */}
        {versions.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Versoes Geradas
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {versions.map((v) => (
                  <Chip
                    key={v.id}
                    label={v.version_name}
                    color={v.status === "finalized" ? "success" : "default"}
                    variant="outlined"
                    onClick={async () => {
                      const data = await getExamPreview(id!, v.id);
                      setPreview(data);
                      setPreviewOpen(true);
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Questions list */}
        <Typography variant="h6" fontWeight={600} mb={2}>
          Questoes da Prova
        </Typography>

        {exam.questions && exam.questions.length > 0 ? (
          <Stack spacing={2}>
            {exam.questions
              .sort((a, b) => a.position - b.position)
              .map((q, idx) => (
                <Card key={q.id}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {idx + 1}. {q.statement}
                        </Typography>
                        <Stack spacing={0.5} mt={1}>
                          {q.alternatives.map((alt, altIdx) => (
                            <Typography
                              key={alt.id}
                              variant="body2"
                              sx={{
                                color: alt.is_correct
                                  ? "success.main"
                                  : "text.secondary",
                                fontWeight: alt.is_correct ? 600 : 400,
                              }}
                            >
                              {String.fromCharCode(65 + altIdx)}) {alt.text}
                              {alt.is_correct && " (correta)"}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                      {!exam.is_finalized && (
                        <Tooltip title="Remover da prova">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveQuestion(q.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
          </Stack>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                Nenhuma questao adicionada a esta prova.
              </Typography>
              {!exam.is_finalized && (
                <Button
                  variant="outlined"
                  onClick={() => navigate(paths.exams.edit(id!))}
                  sx={{ mt: 1 }}
                >
                  Adicionar Questoes
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preview dialog */}
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Preview: {preview?.title}
            {preview?.versionLabel && ` (${preview.versionLabel})`}
          </DialogTitle>
          <DialogContent dividers>
            {preview?.questions.map((q) => (
              <Box key={q.number} mb={3}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {q.number}. {q.statement}
                </Typography>
                {q.alternatives.map((alt) => (
                  <Typography key={alt.letter} variant="body2" sx={{ ml: 2, mb: 0.5 }}>
                    {alt.letter}) {alt.text}
                  </Typography>
                ))}
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewOpen(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>

        {/* PDF export dialog */}
        <ExportPdfDialog
          open={pdfOpen}
          onClose={() => setPdfOpen(false)}
          onExport={handleExportPdf}
          onPreview={handlePreviewPdf}
          loading={pdfLoading}
          examTitle={exam.title}
          versions={versions}
        />

        {/* Generate versions dialog */}
        <Dialog open={versionsOpen} onClose={() => setVersionsOpen(false)}>
          <DialogTitle>Gerar Versoes Embaralhadas</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Quantas versoes deseja gerar? (max 26)
            </Typography>
            <TextField
              type="number"
              label="Quantidade"
              value={versionsCount}
              onChange={(e) =>
                setVersionsCount(
                  Math.min(26, Math.max(1, Number(e.target.value))),
                )
              }
              slotProps={{ htmlInput: { min: 1, max: 26 } }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVersionsOpen(false)}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleGenerateVersions}
              disabled={versionsLoading}
            >
              {versionsLoading ? <CircularProgress size={20} /> : "Gerar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppLayout>
  );
}
