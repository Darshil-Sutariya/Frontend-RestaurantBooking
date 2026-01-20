import axios from "axios";

export const tableResponseApi = () => {
  const token = localStorage.getItem("token");

  return axios.get(
    "http://localhost:5000/api/table/view",
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
    `http://localhost:5000/api/table/occupy/${tableId}`,
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
    "http://localhost:5000/api/table/create",
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
    `http://localhost:5000/api/table/delete/${id}`,
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
    `http://localhost:5000/api/table/update/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

