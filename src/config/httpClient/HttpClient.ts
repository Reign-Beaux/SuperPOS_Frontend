import axios, { type AxiosResponse } from "axios";
import { useCallback, useRef } from "react";
import { useInterceptor } from "./Interceptors";

export const useHttpClient = () => {
    useInterceptor();

    const activeControllersRef = useRef<AbortController[]>([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    const addController = useCallback((controller: AbortController) => {
        activeControllersRef.current.push(controller);
    }, []);

    const removeController = useCallback((controller: AbortController) => {
        activeControllersRef.current = activeControllersRef.current.filter((c) => c !== controller);
    }, []);

    const get = useCallback(async <R>(endpoint: string) => {
        const abortController = new AbortController();
        addController(abortController);

        try {
            const response: AxiosResponse<R> = await axios.get(`${apiUrl}/${endpoint}`, {
                signal: abortController.signal,
            });
            return response.data;
        } catch (error) {
            if (abortController.signal.aborted) {
                throw new Error("Request cancelled");
            }
            throw error;
        } finally {
            removeController(abortController);
        }
    }, [addController, removeController, apiUrl]);

    const post = useCallback(async <D, R>(endpoint: string, data: D) => {
        const abortController = new AbortController();
        addController(abortController);

        try {
            const response: AxiosResponse<R> = await axios.post(`${apiUrl}/${endpoint}`, data, {
                signal: abortController.signal,
            });
            return response.data;
        } catch (error) {
            if (abortController.signal.aborted) {
                throw new Error("Request cancelled");
            }
            throw error;
        } finally {
            removeController(abortController);
        }
    }, [addController, removeController, apiUrl]);

    const put = useCallback(async <D, R>(endpoint: string, data: D) => {
        const abortController = new AbortController();
        addController(abortController);

        try {
            const response: AxiosResponse<R> = await axios.put(`${apiUrl}/${endpoint}`, data, {
                signal: abortController.signal,
            });
            return response.data;
        } catch (error) {
            if (abortController.signal.aborted) {
                throw new Error("Request cancelled");
            }
            throw error;
        } finally {
            removeController(abortController);
        }
    }, [addController, removeController, apiUrl]);

    const remove = useCallback(async <T>(endpoint: string) => {
        const abortController = new AbortController();
        addController(abortController);

        try {
            const response: AxiosResponse<T> = await axios.delete(`${apiUrl}/${endpoint}`, {
                signal: abortController.signal,
            });
            return response.data;
        } catch (error) {
            if (abortController.signal.aborted) {
                throw new Error("Request cancelled");
            }
            throw error;
        } finally {
            removeController(abortController);
        }
    }, [addController, removeController, apiUrl]);

    const cancelAllRequests = useCallback(() => {
        activeControllersRef.current.forEach((controller) => {
            if (!controller.signal.aborted) {
                controller.abort();
            }
        });
        activeControllersRef.current = [];
    }, []);

    return {
        get,
        post,
        put,
        remove,
        cancelAllRequests,
    };
};