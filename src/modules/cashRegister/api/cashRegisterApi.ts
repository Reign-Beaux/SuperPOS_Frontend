import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
import type { CashRegister, CreateCashRegisterRequest, CashRegisterResponse } from "../models/CashRegister";

const endpoints = {
    getAll: "CashRegister",
    getById: (id: string) => `CashRegister/${id}`,
    create: "CashRegister",
    getReport: (id: string) => `CashRegister/${id}/report`,
};

export const useCashRegisterApi = () => {
    const { get, post } = useHttpClient();

    const getAllCashRegisters = useCallback(async () => {
        return await get<CashRegister[]>(endpoints.getAll);
    }, [get]);

    const getCashRegisterById = useCallback(async (id: string) => {
        return await get<CashRegister>(endpoints.getById(id));
    }, [get]);

    const createCashRegister = useCallback(async (data: CreateCashRegisterRequest) => {
        return await post<CreateCashRegisterRequest, CashRegisterResponse>(endpoints.create, data);
    }, [post]);

    const downloadCashRegisterReport = useCallback(async (id: string) => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/CashRegister/${id}/report`, {
            method: 'GET',
            headers: {
                'Accept': 'application/pdf',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to download report');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Corte-Caja-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, []);

    return {
        getAllCashRegisters,
        getCashRegisterById,
        createCashRegister,
        downloadCashRegisterReport,
    };
};
