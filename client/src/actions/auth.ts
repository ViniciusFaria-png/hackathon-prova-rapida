import axiosInstance, { endpoints } from "../lib/axios";

export async function signUp(data: {
  email: string;
  senha: string;
  professorName?: string;
}) {
  console.log("SignUp - Enviando dados:", data);
  const res = await axiosInstance.post(endpoints.user, data);
  console.log("SignUp - Resposta:", res.data);
  return res.data;
}

export async function signIn(data: { email: string; senha: string }) {
  console.log("🔐 SignIn - Enviando dados:", {
    email: data.email,
    senha: "***",
  });

  const res = await axiosInstance.post(`${endpoints.user}/signin`, data);

  console.log("SignIn - Resposta completa:", res);
  console.log("SignIn - res.data:", res.data);
  console.log("SignIn - Token recebido:", res.data.token);
  console.log("SignIn - User recebido:", res.data.user);

  // Salva o token no localStorage
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    console.log("Token salvo no localStorage");
  } else {
    console.error("Token não veio na resposta!");
  }

  return res.data;
}

export async function getCurrentUser() {
  console.log("Buscando usuário atual...");
  const res = await axiosInstance.get(`${endpoints.user}/me`);
  console.log("getCurrentUser - Resposta:", res.data);
  return res.data;
}

export async function validateToken() {
  console.log("Validando token...");
  try {
    const res = await axiosInstance.get(`${endpoints.user}/me`);
    console.log("Token válido - Resposta:", res.data);
    return res.data;
  } catch (error) {
    console.error("Token inválido:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    throw error;
  }
}
