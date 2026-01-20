import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/user",
  withCredentials: true
});

export const signupUser = (data) => API.post("/signup", data);
export const loginUser = (data) => API.post("/login", data);

export default API;
