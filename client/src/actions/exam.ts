import axiosInstance, { endpoints } from "../lib/axios";
import type {
  CreateExamData,
  ExamFilters,
  ExamPreview,
  ExamStats,
  IExam,
  IExamVersion,
  UpdateExamData,
} from "../types/exam";
import type { PaginatedResponse } from "../types/question";

export type PdfEcoMode = "normal" | "save-paper" | "save-ink" | "eco-max" | "accessibility";

export interface EcoModeInfo {
  mode: PdfEcoMode;
  label: string;
  description: string;
  savings: { paper: string; ink: string };
}

export async function getExams(filters?: ExamFilters) {
  const params = new URLSearchParams();
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.subject) params.set("subject", filters.subject);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.status) params.set("status", filters.status);
  const res = await axiosInstance.get(`${endpoints.exams}?${params.toString()}`);
  return res.data as { success: boolean } & PaginatedResponse<IExam>;
}

export async function getExamById(id: string) {
  const res = await axiosInstance.get(`${endpoints.exams}/${id}`);
  return res.data as IExam;
}

export async function createExam(data: CreateExamData) {
  const res = await axiosInstance.post(endpoints.exams, data);
  return res.data as { id: string };
}

export async function updateExam(id: string, data: UpdateExamData) {
  await axiosInstance.put(`${endpoints.exams}/${id}`, data);
}

export async function deleteExam(id: string) {
  await axiosInstance.delete(`${endpoints.exams}/${id}`);
}

export async function addQuestionToExam(
  examId: string,
  questionId: string,
  position: number,
) {
  await axiosInstance.post(`${endpoints.exams}/${examId}/questions`, {
    questionId,
    position,
  });
}

export interface BatchAddQuestionsPayload {
  questions: Array<{ questionId: string; position: number }>;
}

export async function addQuestionsToExamBatch(
  examId: string,
  questions: Array<{ questionId: string; position: number }>,
): Promise<void> {
  await axiosInstance.post(`${endpoints.exams}/${examId}/questions/batch`, {
    questions,
  });
}

export async function removeQuestionFromExam(
  examId: string,
  questionId: string,
) {
  await axiosInstance.delete(
    `${endpoints.exams}/${examId}/questions/${questionId}`,
  );
}

export async function reorderExamQuestions(
  examId: string,
  questions: { questionId: string; position: number }[],
) {
  await axiosInstance.put(`${endpoints.exams}/${examId}/questions/reorder`, {
    questions,
  });
}

export async function shuffleExam(examId: string, versionName: string) {
  const res = await axiosInstance.post(`${endpoints.exams}/${examId}/shuffle`, {
    versionName,
  });
  return res.data as IExamVersion;
}

export async function getExamPreview(examId: string, versionId?: string) {
  const params = versionId ? `?versionId=${versionId}` : "";
  const res = await axiosInstance.get(
    `${endpoints.exams}/${examId}/preview${params}`,
  );
  return res.data.data as ExamPreview;
}

export async function duplicateExam(examId: string, newTitle?: string) {
  const res = await axiosInstance.post(
    `${endpoints.exams}/${examId}/duplicate`,
    { newTitle },
  );
  return res.data as { id: string };
}

export async function finalizeExam(examId: string) {
  const res = await axiosInstance.post(
    `${endpoints.exams}/${examId}/finalize`,
  );
  return res.data;
}

export async function generateExamVersions(examId: string, count: number) {
  const res = await axiosInstance.post(
    `${endpoints.exams}/${examId}/generate-versions`,
    { count },
  );
  const raw = res.data.data as Array<{ versionId: string; seed: number; label: string }>;
  return raw.map((v) => ({
    id: v.versionId,
    exam_id: examId,
    version_name: v.label,
    shuffle_seed: v.seed,
    status: "finalized" as const,
    created_at: new Date().toISOString(),
  }));
}

export async function getExamStats(examId: string) {
  const res = await axiosInstance.get(`${endpoints.exams}/${examId}/stats`);
  return res.data.data as ExamStats;
}

export async function validateExam(examId: string) {
  const res = await axiosInstance.post(
    `${endpoints.exams}/${examId}/validate`,
  );
  return res.data.data;
}

export async function getEcoModes(): Promise<EcoModeInfo[]> {
  const res = await axiosInstance.get(`${endpoints.exams}/eco-modes`);
  return res.data.modes;
}

export async function exportExamPdf(
  examId: string,
  options?: {
    versionId?: string;
    includeAnswerKey?: boolean;
    ecoMode?: PdfEcoMode;
  },
): Promise<void> {
  const params = new URLSearchParams();
  if (options?.versionId) params.set("versionId", options.versionId);
  if (options?.includeAnswerKey) params.set("includeAnswerKey", "true");
  if (options?.ecoMode) params.set("ecoMode", options.ecoMode);
  const res = await axiosInstance.get(
    `${endpoints.exams}/${examId}/export?${params.toString()}`,
    { responseType: "blob" },
  );
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `prova-${examId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function previewExamPdf(
  examId: string,
  options?: {
    versionId?: string;
    includeAnswerKey?: boolean;
    ecoMode?: PdfEcoMode;
  },
): Promise<void> {
  const params = new URLSearchParams();
  if (options?.versionId) params.set("versionId", options.versionId);
  if (options?.includeAnswerKey) params.set("includeAnswerKey", "true");
  if (options?.ecoMode) params.set("ecoMode", options.ecoMode);
  const res = await axiosInstance.get(
    `${endpoints.exams}/${examId}/export?${params.toString()}`,
    { responseType: "blob" },
  );
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  window.open(url, "_blank");
}

export async function exportAnswerKeyPdf(
  examId: string,
  options?: {
    versionId?: string;
    ecoMode?: PdfEcoMode;
  },
): Promise<void> {
  const params = new URLSearchParams();
  if (options?.versionId) params.set("versionId", options.versionId);
  if (options?.ecoMode) params.set("ecoMode", options.ecoMode);
  const res = await axiosInstance.get(
    `${endpoints.exams}/${examId}/answer-key?${params.toString()}`,
    { responseType: "blob" },
  );
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `gabarito-${examId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
