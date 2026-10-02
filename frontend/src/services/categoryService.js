// ============================================================
// CATEGORY API SERVICE
// ============================================================

import axios from "axios";


// ============================================================
// BASE API URL
// ============================================================

const API_URL =
  "http://localhost:8080/api/categories";


// ============================================================
// GET ALL CATEGORIES
// ============================================================

export const getAllCategories = () => {

  return axios.get(API_URL);

};


// ============================================================
// GET CATEGORY BY ID
// ============================================================

export const getCategoryById = (id) => {

  return axios.get(
    `${API_URL}/${id}`
  );

};


// ============================================================
// ADD CATEGORY
// ============================================================

export const addCategory = (category) => {

  return axios.post(
    API_URL,
    category
  );

};


// ============================================================
// UPDATE CATEGORY
// ============================================================

export const updateCategory = (
  id,
  category
) => {

  return axios.put(
    `${API_URL}/${id}`,
    category
  );

};


// ============================================================
// DELETE CATEGORY
// ============================================================

export const deleteCategory = (id) => {

  return axios.delete(
    `${API_URL}/${id}`
  );

};