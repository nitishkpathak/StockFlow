import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// Login user
export const loginUser = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

// Save logged-in user
export const saveAuthData = (data) => {
  localStorage.setItem("token", data.token);

  localStorage.setItem(
    "user",
    JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,

      // Company information
      companyId: data.companyId,
      companyName: data.companyName,
    })
  );
};

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get logged-in user
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();

  return user?.role || null;
};

// Get company ID
export const getCompanyId = () => {
  const user = getCurrentUser();

  return user?.companyId || null;
};

// Get company name
export const getCompanyName = () => {
  const user = getCurrentUser();

  return user?.companyName || null;
};

// Check if current user is ADMIN
export const isAdmin = () => {
  return getUserRole() === "ADMIN";
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check login status
export const isLoggedIn = () => {
  return Boolean(getToken());
};