import axios from "axios";

// Using Vite proxy to avoid CORS issues in development
const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    // Basic PHP auth if needed, but here we just check presence or pass in header
    // Our PHP script didn't check Authorization header, but we can verify later.
    // For now, let's just use it to gate frontend routes.
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post("/login", { username, password });
  if (response.data.token) {
    localStorage.setItem("adminToken", response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login";
};

export const getContent = async () => {
  const response = await api.get("/content");
  return response.data;
};

export const updateContent = async (data) => {
  const response = await api.post("/content", data);
  return response.data;
};

export const uploadFile = async (file: File): Promise<{success: boolean, url: string, message: string, filename?: string}> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload", formData);
  return response.data; // { success: true, url: "/backend/uploads/filename.jpg", message: "File uploaded successfully", filename: "filename.jpg" }
};

export default api;
