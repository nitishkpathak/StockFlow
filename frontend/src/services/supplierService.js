import axios from "axios";

const API_URL = "http://localhost:8080/api/suppliers";

// Get all suppliers
export const getAllSuppliers = () => {
  return axios.get(API_URL);
};

// Get supplier by ID
export const getSupplierById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Add supplier
export const addSupplier = (supplier) => {
  return axios.post(API_URL, supplier);
};

// Update supplier
export const updateSupplier = (id, supplier) => {
  return axios.put(`${API_URL}/${id}`, supplier);
};

// Delete supplier
export const deleteSupplier = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};