import {
    Add as AddIcon,
    ArrowBack,
    Close as RemoveIcon,
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    createAlternative,
    deleteAlternative,
    updateAlternative,
} from "../../actions/alternative";
import {
    createQuestion,
    getQuestionById,
    updateQuestion,
} from "../../actions/question";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../hooks/useAuth";
import { paths } from "../../routes/paths";

interface AlternativeForm {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export function QuestionCreateEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [statement, setStatement] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [isPublic, setIsPublic] = useState(false);
  const [alternatives, setAlternatives] = useState<AlternativeForm[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [isCopy, setIsCopy] = useState(false);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadQuestion();
  }, [id]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const q = await getQuestionById(id!);
      setStatement(q.statement);
      setSubject(q.subject);
      setDifficulty(q.difficulty);
      setIsPublic(q.is_public);
      setAlternatives(
        q.alternatives.map((a) => ({
          id: a.id,
          text: a.text,
          isCorrect: a.is_correct,
        })),
      );
      if (user && q.user_id && q.user_id !== user.id) {
        setIsCopy(true);
        setIsPublic(false);
      }
    } catch {
      setError("Erro ao carregar questao.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlternative = () => {
    if (alternatives.length >= 6) return;
    setAlternatives([...alternatives, { text: "", isCorrect: false }]);
  };

  const handleRemoveAlternative = async (index: number) => {
    if (alternatives.length <= 2) return;
    const alt = alternatives[index];
    if (isEditing && alt.id) {
      try {
        await deleteAlternative(alt.id);
      } catch {
        setError("Erro ao remover alternativa.");
        return;
      }
    }
    setAlternatives(alternatives.filter((_, i) => i !== index));
  };

  const handleAlternativeChange = (
    index: number,
    field: "text" | "isCorrect",
    value: string | boolean,
  ) => {
    if (field === "isCorrect" && value === true) {
      setAlternatives(
        alternatives.map((alt, i) => ({ ...alt, isCorrect: i === index })),
      );
    } else {
      setAlternatives(
        alternatives.map((alt, i) => (i === index ? { ...alt, [field]: value } : alt)),
      );
    }
  };

  const validate = (): string | null => {
    if (!statement.trim()) return "O enunciado e obrigatorio.";
    if (!subject.trim()) return "A materia e obrigatoria.";
    if (alternatives.length < 2) return "Minimo de 2 alternativas.";
    if (alternatives.some((a) => !a.text.trim()))
      return "Todas as alternativas devem ter texto.";
    if (!alternatives.some((a) => a.isCorrect))
      return "Pelo menos uma alternativa deve ser correta.";
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isEditing && !isCopy) {
        await updateQuestion(id!, { statement, subject, difficulty, isPublic });
        for (const alt of alternatives) {
          if (alt.id) {
            await updateAlternative(alt.id, {
              text: alt.text,
              isCorrect: alt.isCorrect,
            });
          } else {
            await createAlternative(id!, {
              text: alt.text,
              isCorrect: alt.isCorrect,
            });
          }
        }
        navigate(paths.questions.root);
      } else {
        await createQuestion({
          statement,
          subject,
          difficulty,
          isPublic,
          alternatives: alternatives.map((a) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        });
        navigate(paths.questions.root);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao salvar questao.");
    } finally {
      setSaving(false);
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

  return (
    <AppLayout>
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(paths.questions.root)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>

        <Typography variant="h4" fontWeight={700} mb={3}>
          {isCopy ? "Copiar Questao" : isEditing ? "Editar Questao" : "Criar Nova Questao"}
        </Typography>

        {isCopy && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Esta questao pertence a outro professor. Uma copia privada sera criada ao salvar.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2.5}>
              <TextField
                label="Enunciado"
                fullWidth
                required
                multiline
                rows={3}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Materia"
                  fullWidth
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <FormControl fullWidth>
                  <InputLabel>Dificuldade</InputLabel>
                  <Select
                    value={difficulty}
                    label="Dificuldade"
                    onChange={(e) =>
                      setDifficulty(e.target.value as "easy" | "medium" | "hard")
                    }
                  >
                    <MenuItem value="easy">Facil</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="hard">Dificil</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <FormControlLabel
                control={
                  <Switch
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                }
                label="Questao publica (visivel para todos)"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Alternatives */}
        <Typography variant="h6" fontWeight={600} mb={2}>
          Alternativas
        </Typography>
        <Stack spacing={1.5} mb={2}>
          {alternatives.map((alt, idx) => (
            <Card key={idx} variant="outlined">
              <CardContent sx={{ py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ minWidth: 28 }}
                  >
                    {String.fromCharCode(65 + idx)})
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={`Texto da alternativa ${String.fromCharCode(65 + idx)}`}
                    value={alt.text}
                    onChange={(e) =>
                      handleAlternativeChange(idx, "text", e.target.value)
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={alt.isCorrect}
                        onChange={(e) =>
                          handleAlternativeChange(idx, "isCorrect", e.target.checked)
                        }
                        color="success"
                        size="small"
                      />
                    }
                    label="Correta"
                    sx={{ whiteSpace: "nowrap" }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveAlternative(idx)}
                    disabled={alternatives.length <= 2}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {alternatives.length < 6 && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddAlternative}
            sx={{ mb: 3 }}
          >
            Adicionar Alternativa
          </Button>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => navigate(paths.questions.root)}
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
            ) : isCopy ? (
              "Criar Copia"
            ) : isEditing ? (
              "Salvar Alteracoes"
            ) : (
              "Criar Questao"
            )}
          </Button>
        </Stack>
      </Box>
    </AppLayout>
  );
}
