export const baseURL="http://89.169.175.33:5000";
// export const baseURL="http://localhost:5000";
import axios from "axios";
import axiosRetry from "axios-retry";


export const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    }
});

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

// Добавляем обработку ответа
axiosInstance.interceptors.response.use(
    (response) => {
        return response; // Возвращаем успешный ответ
    },
    (error) => {
        // Проверяем статус кода
        if (error.response && error.response.status === 403) {
            console.log('Доступ запрещен. Перенаправление на страницу входа...');
            window.location.href = '/login'; // Перенаправляем на страницу входа
        }
        if (error.response && error.response.status === 400){
          console.log(error.response)
          alert(error.response.data.message)
        }
        return Promise.reject(error); // Обработка других ошибок
    }
);

axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: (retryCount) => {
        console.log(`Попытка ретрай ${retryCount}`);
        return retryCount * 1000; 
    },
    retryCondition: (error) => {
        // Повторяем запрос только для ошибок сети или 5xx HTTP-кодов
        return error.code === 'ECONNABORTED' || axiosRetry.isNetworkOrIdempotentRequestError(error);
    },
});
