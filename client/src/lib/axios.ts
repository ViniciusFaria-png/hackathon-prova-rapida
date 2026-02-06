import axios from "axios";
import { globalCONFIG } from "../../global-config";

const axiosInstance = axios.create({
  baseURL: globalCONFIG.serverURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

export const endpoints = {
  posts: "/posts",
  user: "/user",
  teacher: "/teacher",
};
