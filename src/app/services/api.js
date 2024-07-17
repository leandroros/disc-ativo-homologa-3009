import axios from "axios";
import cors from 'cors';
import { getToken } from "./auth.js";

/*  SETAR O AMBIENTE VIA setAmbiente.js */
const URL = 'https://homologa.epsoft.com.br:8088'

const versao = '240416.1548';
const ambiente = 'HOMOLOGA';

console.log(`%c Versão Front REACT: ${versao} - ${ambiente}` , "color: black ; background-color: #00ff0085 ; font-weight: bold")

const api = axios.create({
  baseURL: URL,

  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": [
      "http://localhost",
      "http://localhost:3003",
      "http://localhost:3005",
      "http://localhost:3009",
      "http://localhost:3014",
      "http://localhost:5001",
      "http://localhost:5002", 
      "http://localhost:5003",
      "http://localhost:5012",
      "http://localhost:8025",
      "http://localhost:8080",
      "http://localhost:8085",
      "http://localhost:8086",
      "http://localhost:3025",
      "http://localhost:3026",
      "http://localhost:3030",
      "localhost:3003",
      "localhost:3005",
      "localhost:3009",
      "localhost:3014",
      "localhost:5001",
      "localhost:5002", 
      "localhost:5003",
      "localhost:5004",
      "localhost:3025",
      "localhost:3026",
      "localhost:3030",
      "localhost:5012",
      "localhost:8025",
      "localhost:8080",
      "localhost:8085",
      "localhost:8086",
      "https://app.epsoft.com.br",
      "https://app.epsoft.com.br:3000", 
      "https://app.epsoft.com.br:3001",
      "https://app.epsoft.com.br:3003",
      "https://app.epsoft.com.br:3004",
      "https://app.epsoft.com.br:3005",
      "https://app.epsoft.com.br:3006", 
      "https://app.epsoft.com.br:3007", 
      "https://app.epsoft.com.br:3008", 
      "https://app.epsoft.com.br:3009", 
      "https://app.epsoft.com.br:3010",
      "https://app.epsoft.com.br:3014",
      "https://app.epsoft.com.br:3015",
      "https://app.epsoft.com.br:3019",
      "https://app.epsoft.com.br:5001",
      "https://app.epsoft.com.br:5002",
      "https://app.epsoft.com.br:5003",
      "https://app.epsoft.com.br:5004",
      "https://app.epsoft.com.br:8012",
      "https://app.epsoft.com.br:8014", 
      "https://app.epsoft.com.br:8025",
      "https://app.epsoft.com.br:8026",
      "https://app.epsoft.com.br:8031", 
      "https://app.epsoft.com.br:8047",
      "https://app.epsoft.com.br:8084",
      "https://app.epsoft.com.br:8086", 
      "https://app.epsoft.com.br:8087",
      "https://app.epsoft.com.br:9898",
      "http://10.1.11.235:3003",
      "http://10.1.11.235:3005",
      "http://10.1.11.235:5002",
      "http://10.1.11.235:8085",
      "http://54.207.116.254:3003",
      "http://54.207.116.254:3009",
      "http://54.207.116.254:8085", 
      "http://54.207.116.254:8088",
      "http://54.207.237.19:3001",
      "http://54.207.237.19:3011", 
      "http://54.207.237.19:3013", 
      "http://54.207.237.19:5003",
      "http://54.207.237.19:8085",
      "http://172.31.8.208:5003",
      "https://homologa.epsoft.com.br:3009",
      "https://homologa.epsoft.com.br:3003",
      "https://homologa.epsoft.com.br:8088",
      "https://homologa.epsoft.com.br:8089",
      "https://dlp.epsoft.com.br:8015",
      "https://dlp.epsoft.com.br:3025",
      "https://dlp.epsoft.com.br:3026",
      "https://dlp.epsoft.com.br:3030",
      "https://dlp.epsoft.com.br:3016",
    ],

    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS, HEADER",
    "Access-Control-Allow-Headers": ["Authorization", "Cache-Control", "Content-Type"],
    "Access-Control-Allow-ExposedHeaders": ["custom-header1", "custom-header2"],
    "Access-Control-Allow-Credentials": "true",
  },
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    cors();
    // axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    // axios.defaults.headers.get['Content-Type'] ='application/json;charset=utf-8';

    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
  }
  return config;
});

export default api;

