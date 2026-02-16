import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
import type { Product, CreateProductRequest, UpdateProductRequest, PagedResponse } from "./models/Product";


const endpoints = {
    getAll: "Product",
    getById: (id: string) => `Product/${id}`,
    create: "Product",
    update: (id: string) => `Product/${id}`,
    delete: (id: string) => `Product/${id}`,
    search: (term: string) => `Product/Search?term=${term}`,
    paged: (pageIndex: number, pageSize: number, searchTerm?: string) => 
        `Product/paged?pageIndex=${pageIndex}&pageSize=${pageSize}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`,
};

export const useProductApi = () => {
    const { get, post, put, remove } = useHttpClient();

    const getAllProducts = useCallback(async () => {
        return await get<Product[]>(endpoints.getAll);
    }, [get]);

    const getPagedProducts = useCallback(async (pageIndex: number, pageSize: number, searchTerm?: string) => {
        return await get<PagedResponse<Product>>(endpoints.paged(pageIndex, pageSize, searchTerm));
    }, [get]);

    const getProductById = useCallback(async (id: string) => {
        return await get<Product>(endpoints.getById(id));
    }, [get]);

    const createProduct = useCallback(async (product: CreateProductRequest) => {
        return await post<CreateProductRequest, Product>(endpoints.create, product);
    }, [post]);

    const updateProduct = useCallback(async (product: UpdateProductRequest) => {
        return await put<UpdateProductRequest, void>(endpoints.update(product.id), product);
    }, [put]);

    const deleteProduct = useCallback(async (id: string) => {
        return await remove<void>(endpoints.delete(id));
    }, [remove]);

    const searchProducts = useCallback(async (term: string) => {
        return await get<Product[]>(endpoints.search(term));
    }, [get]);

    return {
        getAllProducts,
        getPagedProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
    };
};
