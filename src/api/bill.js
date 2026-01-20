import axios from "axios";


export const viewBill = () => {
  const token = localStorage.getItem("token");
  return axios.get(
    "http://localhost:5000/api/bill/view",
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
    "http://localhost:5000/api/bill/create",
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
    `http://localhost:5000/api/bill/close/${id}`,
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
    `http://localhost:5000/api/bill/update/${id}`,
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
    `http://localhost:5000/api/bill/delete/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    }
  );
};
