import axios from "axios";

const API_URL =
  "http://localhost:8080/api/stock-transactions";

// Get all stock transactions
export const getAllTransactions = () => {
  return axios.get(API_URL);
};