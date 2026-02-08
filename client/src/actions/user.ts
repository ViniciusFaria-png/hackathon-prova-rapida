import axiosInstance, { endpoints } from "../lib/axios";
import type { IUser } from "../types/user";

export async function getUsers() {
  const res = await axiosInstance.get(endpoints.user);
  return res.data.users as IUser[];
}

export async function getUserById(id: string) {
  const res = await axiosInstance.get(`${endpoints.user}/${id}`);
  return res.data.user as IUser;
}

export async function updateUser(
  id: string,
  data: { email?: string; password?: string },
) {
  const res = await axiosInstance.put(`${endpoints.user}/${id}`, data);
  return res.data;
}

export async function deleteUser(id: string) {
  await axiosInstance.delete(`${endpoints.user}/${id}`);
}
