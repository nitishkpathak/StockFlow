// ============================================================
// CATEGORY API SERVICE
// ============================================================

import axios from "axios";
import API_URL from "./apiConfig";


// ============================================================
// BASE API URL
// ============================================================

const CATEGORY_API_URL =
  `${API_URL}/categories`;


// ============================================================
// GET ALL CATEGORIES
// ============================================================

export const getAllCategories = () => {

  return axios.get(CATEGORY_API_URL);

};


// ============================================================
// GET CATEGORY BY ID
// ============================================================

export const getCategoryById = (id) => {

  return axios.get(
    `${CATEGORY_API_URL}/${id}`
  );

};


// ============================================================
// ADD CATEGORY
// ============================================================

export const addCategory = (category) => {

  return axios.post(
    CATEGORY_API_URL,
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
    `${CATEGORY_API_URL}/${id}`,
    category
  );

};


// ============================================================
// DELETE CATEGORY
// ============================================================

export const deleteCategory = (id) => {

  return axios.delete(
    `${CATEGORY_API_URL}/${id}`
  );

};