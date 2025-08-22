// src/services/schemeService.js
import api from "./api";

// Fetch schemes with search, filter, pagination
export const getSchemes = async (params = {}) => {
    const res = await api.get("/schemes", { params });
    return res.data;
};

// Fetch categories
export const getCategories = async () => {
    const res = await api.get("/schemes/categories");
    return res.data;
};

// Admin-only CRUD
export const createScheme = async (scheme) => {
    const res = await api.post("/schemes", scheme);
    return res.data;
};

export const updateScheme = async (id, scheme) => {
    const res = await api.put(`/schemes/${id}`, scheme);
    return res.data;
};

export const deleteScheme = async (id) => {
    const res = await api.delete(`/schemes/${id}`);
    return res.data;
};
