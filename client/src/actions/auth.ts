import axiosInstance, { endpoints } from "../lib/axios";

export async function signUp(data: {
  email: string;
  password: string;
  name: string;
}) {
  const res = await axiosInstance.post(endpoints.users, data);
  return res.data;
}

export async function signIn(data: { email: string; password: string }) {
  const res = await axiosInstance.post(endpoints.auth.login, data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
}

export async function getCurrentUser() {
  const res = await axiosInstance.get(`${endpoints.users}/me`);
  return res.data;
}

export async function updateProfile(data: { name?: string; email?: string }) {
  const res = await axiosInstance.put(`${endpoints.users}/me`, data);
  return res.data;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await axiosInstance.put(`${endpoints.users}/me/password`, data);
  return res.data;
}

export async function logoutApi() {
  const res = await axiosInstance.post(endpoints.auth.logout);
  return res.data;
}
