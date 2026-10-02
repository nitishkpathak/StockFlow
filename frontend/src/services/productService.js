import axios from "axios";
import API_URL from "./apiConfig";

const PRODUCT_API_URL = `${API_URL}/products`;

// Get all products
export const getAllProducts = () => {
  return axios.get(PRODUCT_API_URL);
};

// Add product
export const addProduct = (product) => {
  return axios.post(PRODUCT_API_URL, product);
};

// Update product
export const updateProduct = (id, product) => {
  return axios.put(`${PRODUCT_API_URL}/${id}`, product);
};

// Delete product
export const deleteProduct = (id) => {
  return axios.delete(`${PRODUCT_API_URL}/${id}`);
};

// Increase stock
export const increaseStock = (id, amount = 1) => {
  return axios.post(
    `${PRODUCT_API_URL}/${id}/stock/increase?amount=${amount}`
  );
};

// Decrease stock
export const decreaseStock = (id, amount = 1) => {
  return axios.post(
    `${PRODUCT_API_URL}/${id}/stock/decrease?amount=${amount}`
  );
};