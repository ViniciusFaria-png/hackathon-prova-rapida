import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Delete as DeleteIcon,
    DragIndicator as DragIcon,
} from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import type { IExamQuestion } from "../types/exam";

interface SortableQuestionItemProps {
  readonly question: IExamQuestion;
  readonly index: number;
  readonly isFinalized: boolean;
  readonly onRemove: (questionId: string) => void;
}

export function SortableQuestionItem({
  question,
  index,
  isFinalized,
  onRemove,
}: SortableQuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id, disabled: isFinalized });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} sx={{ position: "relative" }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
        >
          {!isFinalized && (
            <Box
              {...attributes}
              {...listeners}
              sx={{
                cursor: "grab",
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
                "&:active": { cursor: "grabbing" },
              }}
            >
              <DragIcon />
            </Box>
          )}

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {index + 1}. {question.statement}
            </Typography>
            <Stack spacing={0.5} mt={1}>
              {question.alternatives.map((alt, altIdx) => (
                <Typography
                  key={alt.id}
                  variant="body2"
                  sx={{
                    color: alt.is_correct ? "success.main" : "text.secondary",
                    fontWeight: alt.is_correct ? 600 : 400,
                  }}
                >
                  {String.fromCodePoint(65 + altIdx)}) {alt.text}
                  {alt.is_correct && " (correta)"}
                </Typography>
              ))}
            </Stack>
          </Box>

          {!isFinalized && (
            <Tooltip title="Remover da prova">
              <IconButton
                size="small"
                color="error"
                onClick={() => onRemove(question.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
