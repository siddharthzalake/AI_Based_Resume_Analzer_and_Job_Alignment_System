import axios from "axios";

const api = axios.create({
  baseURL:`${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
  timeout: 240000
});

export default api;
