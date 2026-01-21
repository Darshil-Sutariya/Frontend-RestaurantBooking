import axios from "axios";
import { baseURL } from ".";

export const tableResponseApi = () => {
  const token = localStorage.getItem("token");

  return axios.get(
     `${baseURL}/table/view`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};


export const occupyTableApi = (tableId) => {
  const token = localStorage.getItem("token");

  return axios.put(
     `${baseURL}/table/occupy/${tableId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const createTable = (data) => {
  const token = localStorage.getItem("token");
  return axios.post(
     `${baseURL}/table/create`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const deleteTable = (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(
     `${baseURL}/table/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    }
  );
};

export const updateTable = (id, data) => {
  const token = localStorage.getItem("token");
  return axios.put(
     `${baseURL}/table/update/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

