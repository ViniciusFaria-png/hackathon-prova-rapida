import {
    EnergySavingsLeaf as EcoIcon,
    Print as InkIcon,
    Description as PaperIcon,
    RecyclingOutlined as RecycleIcon,
} from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";
import { useState } from "react";
import type { PdfEcoMode } from "../actions/exam";

interface EcoModeOption {
  mode: PdfEcoMode;
  label: string;
  description: string;
  icon: React.ReactNode;
  paperSavings: string;
  inkSavings: string;
  color: string;
}

const ECO_MODE_OPTIONS: EcoModeOption[] = [
  {
    mode: "normal",
    label: "Normal",
    description: "Layout padrão com margens confortáveis e formatação completa.",
    icon: <PaperIcon fontSize="large" />,
    paperSavings: "0%",
    inkSavings: "0%",
    color: "#1976d2",
  },
  {
    mode: "save-paper",
    label: "Economia de Papel",
    description:
      "Margens reduzidas, fonte menor e espaçamentos compactos. Cabe mais questões por página.",
    icon: <EcoIcon fontSize="large" />,
    paperSavings: "~30-40%",
    inkSavings: "0%",
    color: "#2e7d32",
  },
  {
    mode: "save-ink",
    label: "Economia de Tinta",
    description:
      "Remove elementos decorativos, usa tons de cinza e evita negrito para gastar menos tinta.",
    icon: <InkIcon fontSize="large" />,
    paperSavings: "0%",
    inkSavings: "~25-35%",
    color: "#ed6c02",
  },
  {
    mode: "eco-max",
    label: "Economia Máxima",
    description:
      "Combina economia de papel e tinta. Ideal para escolas com orçamento limitado.",
    icon: <RecycleIcon fontSize="large" />,
    paperSavings: "~40-50%",
    inkSavings: "~25-35%",
    color: "#9c27b0",
  },
];

interface ExportPdfDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (ecoMode: PdfEcoMode, includeAnswerKey: boolean) => void;
  onPreview: (ecoMode: PdfEcoMode) => void;
  loading?: boolean;
  examTitle?: string;
}

export default function ExportPdfDialog({
  open,
  onClose,
  onExport,
  onPreview,
  loading = false,
  examTitle,
}: ExportPdfDialogProps) {
  const [selectedMode, setSelectedMode] = useState<PdfEcoMode>("normal");

  const handlePreview = () => {
    onPreview(selectedMode);
  };

  const handleExportExam = () => {
    onExport(selectedMode, false);
  };

  const handleExportAnswerKey = () => {
    onExport(selectedMode, true);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EcoIcon color="success" />
          <Box>
            <Typography variant="h6" component="span">
              Exportar PDF
            </Typography>
            {examTitle && (
              <Typography variant="body2" color="text.secondary">
                {examTitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="subtitle2" gutterBottom sx={{ mt: 1, mb: 2 }}>
          Escolha o modo de impressão:
        </Typography>

        <Stack spacing={2}>
          {ECO_MODE_OPTIONS.map((option) => {
            const isSelected = selectedMode === option.mode;
            return (
              <Card
                key={option.mode}
                variant="outlined"
                sx={{
                  borderColor: isSelected ? option.color : "divider",
                  borderWidth: isSelected ? 2 : 1,
                  bgcolor: isSelected ? `${option.color}08` : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <CardActionArea onClick={() => setSelectedMode(option.mode)}>
                  <CardContent sx={{ py: 1.5 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ color: option.color, display: "flex" }}>
                        {option.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {option.label}
                          </Typography>
                          {isSelected && (
                            <Chip
                              label="Selecionado"
                              size="small"
                              sx={{
                                bgcolor: option.color,
                                color: "white",
                                height: 20,
                                fontSize: "0.7rem",
                              }}
                            />
                          )}
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.3 }}
                        >
                          {option.description}
                        </Typography>
                      </Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ minWidth: 180, justifyContent: "flex-end" }}
                      >
                        {option.paperSavings !== "0%" && (
                          <Chip
                            icon={<EcoIcon sx={{ fontSize: 14 }} />}
                            label={`Papel ${option.paperSavings}`}
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        )}
                        {option.inkSavings !== "0%" && (
                          <Chip
                            icon={<InkIcon sx={{ fontSize: 14 }} />}
                            label={`Tinta ${option.inkSavings}`}
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="outlined"
          color="info"
          onClick={handlePreview}
          disabled={loading}
        >
          Visualizar
        </Button>
        <Button
          variant="outlined"
          onClick={handleExportAnswerKey}
          disabled={loading}
          startIcon={<PaperIcon />}
        >
          {loading ? "Gerando..." : "Exportar Gabarito"}
        </Button>
        <Button
          variant="contained"
          onClick={handleExportExam}
          disabled={loading}
          startIcon={<EcoIcon />}
        >
          {loading ? "Gerando..." : "Exportar Prova"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
