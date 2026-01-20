import axios from "axios";

export const categoriesResponseApi = () => {
  const token = localStorage.getItem("token");

  return axios.get(
    "http://localhost:5000/api/category/view",
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
    "http://localhost:5000/api/category/create", data,
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
    `http://localhost:5000/api/category/update/${id}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteCategory = (id) => {
  const token = localStorage.getItem("token");

  return axios.delete(
    `http://localhost:5000/api/category/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};