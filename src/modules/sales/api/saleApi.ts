import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
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

    return {
        getAllSales,
        getSaleById,
        createSale,
    };
};
