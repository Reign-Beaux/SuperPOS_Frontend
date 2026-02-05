import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
import type { Inventory, InventoryAdjustRequest } from "../models/Inventory";

const endpoints = {
    getAll: "Inventory",
    getByProduct: (productId: string) => `Inventory/product/${productId}`,
    adjust: "Inventory/adjust",
};

export const useInventoryApi = () => {
    const { get, post } = useHttpClient();

    const getAllInventories = useCallback(async () => {
        return await get<Inventory[]>(endpoints.getAll);
    }, [get]);

    const getInventoryByProduct = useCallback(async (productId: string) => {
        return await get<Inventory>(endpoints.getByProduct(productId));
    }, [get]);

    const adjustInventory = useCallback(async (request: InventoryAdjustRequest) => {
        return await post<InventoryAdjustRequest, Inventory>(endpoints.adjust, request);
    }, [post]);

    return {
        getAllInventories,
        getInventoryByProduct,
        adjustInventory,
    };
};
