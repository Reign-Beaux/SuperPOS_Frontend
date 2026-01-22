import { useHttpClient } from "@/config/httpClient";
import type { Product, CreateProductRequest, UpdateProductRequest } from "./models/Product";


const endpoints = {
    getAll: "Product",
    getById: (id: string) => `Product/${id}`,
    create: "Product",
    update: (id: string) => `Product/${id}`,
    delete: (id: string) => `Product/${id}`,
};

export const useProductApi = () => {
    const { get, post, put, remove } = useHttpClient();

    const getAllProducts = async () => {
        return await get<Product[]>(endpoints.getAll);
    };

    const getProductById = async (id: string) => {
        return await get<Product>(endpoints.getById(id));
    };

    const createProduct = async (product: CreateProductRequest) => {
        return await post<CreateProductRequest, Product>(endpoints.create, product);
    };

    const updateProduct = async (product: UpdateProductRequest) => {
        const { id, ...data } = product;
        return await put<Omit<UpdateProductRequest, 'id'>, void>(endpoints.update(id), data);
    };

    const deleteProduct = async (id: string) => {
        return await remove<void>(endpoints.delete(id));
    };

    return {
        getAllProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};
