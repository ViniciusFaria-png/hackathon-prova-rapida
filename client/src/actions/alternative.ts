import axiosInstance, { endpoints } from "../lib/axios";
import type {
  CreateAlternativeData,
  UpdateAlternativeData,
} from "../types/alternative";

export async function createAlternative(
  questionId: string,
  data: CreateAlternativeData,
) {
  const res = await axiosInstance.post(
    `${endpoints.questions}/${questionId}/alternatives`,
    data,
  );
  return res.data as { id: string };
}

export async function updateAlternative(
  id: string,
  data: UpdateAlternativeData,
) {
  await axiosInstance.put(`${endpoints.alternatives}/${id}`, data);
}

export async function deleteAlternative(id: string) {
  await axiosInstance.delete(`${endpoints.alternatives}/${id}`);
}
