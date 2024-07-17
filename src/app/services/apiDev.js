import axios from "axios";

import { getToken } from "./auth.js";

const isDevelopment = true;

const DEV = "https://app.epsoft.com.br:8025"
const PRD = "https://app.epsoft.com.br:8086"


const apiDev = axios.create({
  baseURL: DEV
});


apiDev.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiDev;

