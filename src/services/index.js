import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const index = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45000,
  withCredentials: true,
});
