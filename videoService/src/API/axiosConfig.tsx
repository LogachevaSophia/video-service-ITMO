import axios from "axios";
import axiosRetry from "axios-retry";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json"
    }
})


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