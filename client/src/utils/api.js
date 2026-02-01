import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Use "export const" for Vite compatibility
export const fetchProducts = (type) => API.get(`/products${type ? `?type=${type}` : ''}`);

export const fetchProductById = (id) => API.get(`/products/${id}`);