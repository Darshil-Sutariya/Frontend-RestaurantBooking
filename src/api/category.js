import axios from "axios";
import { baseURL } from ".";

export const categoriesResponseApi = () => {
  const token = localStorage.getItem("token");

  return axios.get(
    `${baseURL}/category/view`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createCategory = (data) => {
    const token = localStorage.getItem("token");

  return axios.post(
     `${baseURL}/category/create`, 
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
} 

export const updateCategory = (id, data) => {
  const token = localStorage.getItem("token");

  return axios.put(
     `${baseURL}/category/update/${id}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteCategory = (id) => {
  const token = localStorage.getItem("token");

  return axios.delete(
     `${baseURL}/category/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};