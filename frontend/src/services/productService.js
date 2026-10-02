import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

// Get all products
export const getAllProducts = () => {
  return axios.get(API_URL);
};

// Add product
export const addProduct = (product) => {
  return axios.post(API_URL, product);
};

// Update product
export const updateProduct = (id, product) => {
  return axios.put(`${API_URL}/${id}`, product);
};

// Delete product
export const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Increase stock
export const increaseStock = (id, amount = 1) => {
  return axios.post(
    `${API_URL}/${id}/stock/increase?amount=${amount}`
  );
};

// Decrease stock
export const decreaseStock = (id, amount = 1) => {
  return axios.post(
    `${API_URL}/${id}/stock/decrease?amount=${amount}`
  );
};