import axios from "axios";
import { baseURL } from ".";

const API = axios.create({
  baseURL: `${baseURL}/user`,
  withCredentials: true
});

export const signupUser = (data) => API.post("/signup", data);
export const loginUser = (data) => API.post("/login", data);

export default API;
