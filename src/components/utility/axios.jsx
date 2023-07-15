import { refreshTokenUrl } from "./api-urls";
import axios from "axios";

// const BASE_URL = process.env.BASE_URL
// axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

axios.interceptors.request.use((config) => {
    return config;

}, (error) => {
    console.error(error);
    return Promise.reject(error);
})

const refreshToken = async () => {
    let refreshToken = localStorage.getItem("refreshToken")
    const config = {
        method: "get",
        url: refreshTokenUrl,
        params: { refreshToken }
    }
    return axios(config);
}

axios.interceptors.response.use((response) => {
    // if (response?.config.url === "/login" || response.config.url === "/refreshToken") {
    //     axios.defaults.headers.common["Authorization"] = `Bearer ${response?.data?.data?.token}`;
    //     localStorage.setItem("token", response?.data?.data?.token);
    //     localStorage.setItem("refreshToken", response?.data?.data?.refreshToken);
    // }
    return response;
}, async (error) => {
    const originalRequest = error?.config;
    if (error?.code === "ERR_NETWORK" || (error?.response?.status === 401 && error?.response?.data?.error === "Unauthorized")) {
        let counter = sessionStorage.getItem('counter');
        if (counter === null || counter === "null") {
            sessionStorage.setItem('counter', 0);
        }
        if (counter <= 3) {
            console.log(counter, typeof counter, !!counter)
            sessionStorage.setItem('counter', Number(counter) + 1)
            const freshTokens = await refreshToken();
            localStorage.setItem('token', freshTokens?.data?.data?.token)
            localStorage.setItem('refreshToken', freshTokens?.data?.data?.refreshToken)
            originalRequest.headers = {
                "Authorization": `Bearer ${freshTokens?.data?.data?.token}`
            }
            return axios(originalRequest);
        }
    } else if ((error?.response?.status === 403 && error?.response?.data === "Logout") || (error?.response?.status === 401 && error?.response?.data == "Invalid Token")) {
        console.log("Logout")
        console.error(error);
        return Promise.reject(error);
    } else {
        console.error(error);
        return Promise.reject(error);
    }
})
export default axios;