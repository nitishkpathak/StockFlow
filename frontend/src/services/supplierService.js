import axios from "axios";
import API_URL from "./apiConfig";

const SUPPLIER_API_URL = `${API_URL}/suppliers`;

// Get all suppliers
export const getAllSuppliers = () => {
  return axios.get(SUPPLIER_API_URL);
};

// Get supplier by ID
export const getSupplierById = (id) => {
  return axios.get(`${SUPPLIER_API_URL}/${id}`);
};

// Add supplier
export const addSupplier = (supplier) => {
  return axios.post(SUPPLIER_API_URL, supplier);
};

// Update supplier
export const updateSupplier = (id, supplier) => {
  return axios.put(`${SUPPLIER_API_URL}/${id}`, supplier);
};

// Delete supplier
export const deleteSupplier = (id) => {
  return axios.delete(`${SUPPLIER_API_URL}/${id}`);
};