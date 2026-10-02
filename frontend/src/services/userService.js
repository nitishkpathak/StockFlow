import axios from "axios";
import API_URL from "./apiConfig";

const USER_API_URL = `${API_URL}/users`;

// Get all users
export const getAllUsers = () => {
  return axios.get(USER_API_URL);
};

// Add user
export const addUser = (user) => {
  return axios.post(USER_API_URL, user);
};

// Update user
export const updateUser = (id, user) => {
  return axios.put(`${USER_API_URL}/${id}`, user);
};

// Delete user
export const deleteUser = (id) => {
  return axios.delete(`${USER_API_URL}/${id}`);
};