import axios, {
    AxiosError,
    type AxiosRequestConfig,
    type AxiosRequestHeaders,
    type AxiosResponse,
} from "axios";
import { useEffect } from "react";

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
    headers: AxiosRequestHeaders;
}

export const useInterceptor = () => {
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config: AdaptAxiosRequestConfig) => {
                return config;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);
};