import axios from "axios";

export const productResponseApi = () => {
  const token = localStorage.getItem("token");

  return axios.get(
    "http://localhost:5000/api/product/view",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const createProduct = (data) => {
  const token = localStorage.getItem("token");
  return axios.post(
    "http://localhost:5000/api/product/create",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const updateProduct = (id, data) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `http://localhost:5000/api/product/update/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const deleteProduct = (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(
    `http://localhost:5000/api/product/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    }
  );
};
