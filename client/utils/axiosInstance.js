import axios from "axios";

const user = localStorage.getItem("user"); 
const token = user ? JSON.parse(user).token : null;
console.log(token)
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
