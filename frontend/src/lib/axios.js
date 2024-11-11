import axios from "axios";

const axiosInstance  = axios.create({
    baseURL: import.meta.env.PROD 
        ? 'https://ecommerce-website-lpzn.onrender.com/api'
        : '/api',
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance ;
