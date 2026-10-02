import axios from "axios";

import {
  getToken,
  logoutUser,
} from "./authService";


// Add JWT token to every request
axios.interceptors.request.use(
  (config) => {

    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// Handle API responses
axios.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    // 401 means token is invalid or expired.
    if (error.response?.status === 401) {

      logoutUser();

      window.location.href = "/login";
    }

    // 403 means user is authenticated
    // but does not have permission.
    // Do not logout the user.

    return Promise.reject(error);
  }
);
