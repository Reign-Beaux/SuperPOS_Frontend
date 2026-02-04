import { useHttpClient } from "@/config/httpClient";
import type { Sale, CreateSaleRequest } from "../models/Sale";

const endpoints = {
    getAll: "Sale",
    getById: (id: string) => `Sale/${id}`,
    create: "Sale",
};

export const useSaleApi = () => {
    const { get, post } = useHttpClient();

    const getAllSales = async () => {
        return await get<Sale[]>(endpoints.getAll);
    };

    const getSaleById = async (id: string) => {
        return await get<Sale>(endpoints.getById(id));
    };

    const createSale = async (sale: CreateSaleRequest) => {
        return await post<CreateSaleRequest, Sale>(endpoints.create, sale);
    };

    return {
        getAllSales,
        getSaleById,
        createSale,
    };
};
