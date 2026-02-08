import axiosInstance, { endpoints } from "../lib/axios";
import type {
  CreateQuestionData,
  IQuestion,
  PaginatedResponse,
  QuestionFilters,
  UpdateQuestionData,
} from "../types/question";

export async function getQuestions(filters?: QuestionFilters) {
  const params = new URLSearchParams();
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.subject) params.set("subject", filters.subject);
  if (filters?.difficulty) params.set("difficulty", filters.difficulty);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.userId) params.set("userId", filters.userId);
  if (filters?.isPublic !== undefined)
    params.set("isPublic", String(filters.isPublic));
  if (filters?.excludeUsedIn)
    params.set("excludeUsedIn", filters.excludeUsedIn);
  const res = await axiosInstance.get(
    `${endpoints.questions}?${params.toString()}`,
  );
  return res.data as { success: boolean } & PaginatedResponse<IQuestion>;
}

export async function getQuestionById(id: string) {
  const res = await axiosInstance.get(`${endpoints.questions}/${id}`);
  return res.data as IQuestion;
}

export async function createQuestion(data: CreateQuestionData) {
  const res = await axiosInstance.post(endpoints.questions, data);
  return res.data.data as { id: string };
}

export async function updateQuestion(id: string, data: UpdateQuestionData) {
  await axiosInstance.put(`${endpoints.questions}/${id}`, data);
}

export async function deleteQuestion(id: string) {
  await axiosInstance.delete(`${endpoints.questions}/${id}`);
}
