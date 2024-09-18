import axios from "axios";
import axiosRetry from "axios-retry";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    }
})

// Добавляем interceptor для установки токена в каждый запрос
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Предположим, что токен хранится в localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: (retryCount)=> {
        console.log(`попытка ретрай ${retryCount}`);
        return retryCount * 1000; 
    },
    retryCondition: (error) => {
        // Повторяем запрос только для ошибок сети или 5xx HTTP-кодов
        return error.code === 'ECONNABORTED' || axiosRetry.isNetworkOrIdempotentRequestError(error);
      },
})