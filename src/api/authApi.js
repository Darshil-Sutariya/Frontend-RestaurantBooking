import axios from "axios";
import { baseURL } from ".";

const API = axios.create({
  baseURL: `${baseURL}/user`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const signupUser = (data) => API.post("/signup", data);
export const loginUser = (data) => API.post("/login", data);

export default API;
