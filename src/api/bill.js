import axios from "axios";
import { baseURL } from ".";


export const viewBill = () => {
  const token = localStorage.getItem("token");
  return axios.get(
    `${baseURL}/bill/view`,
    {
      headers: {
        Authorization: `Bearer ${token}`    
      }
    }
  );
};


export const createBill = (data) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${baseURL}/bill/create`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};


export const closeBill = (id, data) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `${baseURL}/bill/close/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const updateBill = (id, data) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `${baseURL}/bill/update/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const deleteBill = (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(
    `${baseURL}/bill/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    }
  );
};
