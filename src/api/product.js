import axios from "axios";
import { baseURL } from ".";

export const productResponseApi = () => {
  const token = localStorage.getItem("token");

  return axios.get(
     `${baseURL}/product/view`,
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
     `${baseURL}/product/create`,
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
     `${baseURL}/product/update/${id}`,
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
     `${baseURL}/product/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    }
  );
};
