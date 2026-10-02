import axios from "axios";
import API_URL from "./apiConfig";

const STOCK_TRANSACTION_API_URL =
  `${API_URL}/stock-transactions`;

// Get all stock transactions
export const getAllTransactions = () => {
  return axios.get(STOCK_TRANSACTION_API_URL);
};