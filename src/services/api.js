import axios from "axios";

// Use environment variable for production, fallback to localhost for development
const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api" 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
