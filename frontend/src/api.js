// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export default API;