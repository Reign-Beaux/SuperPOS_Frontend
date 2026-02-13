import axios, {
    AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from "axios";
import { useEffect, useRef } from "react";
import { authService } from "../../modules/Auth/services/AuthService";
import { useNavigate } from "react-router-dom";

// Helper to check for retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const useInterceptor = () => {
    const navigate = useNavigate();
    // Use refs to prevent multiple interceptor registrations if component re-renders
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        // Prevent double registration in Strict Mode
        if (cleanupRef.current) {
           return;
        }
       
        const requestInterceptor = axios.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = authService.getAccessToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
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
            async (error: AxiosError) => {
                const originalRequest = error.config as CustomAxiosRequestConfig;
                
                // Don't retry if:
                // 1. Already retried
                // 2. No config available
                // 3. Request is to auth endpoints (login, refresh, logout)
                const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
                
                if (
                    error.response?.status === 401 && 
                    originalRequest && 
                    !originalRequest._retry &&
                    !isAuthEndpoint
                ) {
                    originalRequest._retry = true;

                    try {
                        const newToken = await authService.refreshAccessToken();
                        if (originalRequest.headers) {
                             originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        }
                        return axios(originalRequest);
                    } catch (refreshError) {
                        // Refresh failed, logout and redirect
                         authService.logout(); // Clear local state
                         navigate("/login");
                         return Promise.reject(refreshError);
                    }
                }
                
                return Promise.reject(error);
            }
        );

        cleanupRef.current = () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
            cleanupRef.current = null;
        };

        return () => {
           if (cleanupRef.current) {
               cleanupRef.current();
           }
        };
    }, [navigate]);
};