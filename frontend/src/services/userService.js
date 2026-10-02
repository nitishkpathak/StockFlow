import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

// Get all users
export const getAllUsers = () => {
  return axios.get(API_URL);
};

// Add user
export const addUser = (user) => {
  return axios.post(API_URL, user);
};

// Update user
export const updateUser = (id, user) => {
  return axios.put(`${API_URL}/${id}`, user);
};

// Delete user
export const deleteUser = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};