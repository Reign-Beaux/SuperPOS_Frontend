import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
import { authService } from "@/modules/Auth/services/AuthService";
import type { Sale, CreateSaleRequest } from "../models/Sale";

const endpoints = {
    getAll: "Sale",
    getById: (id: string) => `Sale/${id}`,
    create: "Sale",
};

export const useSaleApi = () => {
    const { get, post } = useHttpClient();

    const getAllSales = useCallback(async () => {
        return await get<Sale[]>(endpoints.getAll);
    }, [get]);

    const getSaleById = useCallback(async (id: string) => {
        return await get<Sale>(endpoints.getById(id));
    }, [get]);

    const createSale = useCallback(async (sale: CreateSaleRequest) => {
        return await post<CreateSaleRequest, Sale>(endpoints.create, sale);
    }, [post]);

    const downloadTicketPdf = useCallback(async (saleId: string) => {
        const token = authService.getAccessToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Sale/${saleId}/ticket`, {
            method: 'GET',
            headers: {
                'Accept': 'application/pdf',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to download ticket');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Ticket-${saleId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, []);

    const cancelSale = useCallback(async (saleId: string, userId: string, reason: string) => {
        return await post<{ userId: string; reason: string }, Sale>(
            `Sale/${saleId}/cancel`,
            { userId, reason }
        );
    }, [post]);

    return {
        getAllSales,
        getSaleById,
        createSale,
        downloadTicketPdf,
        cancelSale,
    };
};
