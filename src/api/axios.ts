import axios from "axios";

// Extend ImportMeta interface to include 'env'

const API = axios.create({
  baseURL: "https://corsproxy.io/https://tikianaly-blog.onrender.com/api/v1/",
});

// Optional: attach token for authenticated requests


export default API;
