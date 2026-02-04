import { useHttpClient } from "@/config/httpClient";
import type { Inventory, InventoryAdjustRequest } from "../models/Inventory";

const endpoints = {
    getAll: "Inventory",
    getByProduct: (productId: string) => `Inventory/product/${productId}`,
    adjust: "Inventory/adjust",
};

export const useInventoryApi = () => {
    const { get, post } = useHttpClient();

    const getAllInventories = async () => {
        return await get<Inventory[]>(endpoints.getAll);
    };

    const getInventoryByProduct = async (productId: string) => {
        return await get<Inventory>(endpoints.getByProduct(productId));
    };

    const adjustInventory = async (request: InventoryAdjustRequest) => {
        return await post<InventoryAdjustRequest, Inventory>(endpoints.adjust, request);
    };

    return {
        getAllInventories,
        getInventoryByProduct,
        adjustInventory,
    };
};
