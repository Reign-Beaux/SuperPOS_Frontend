import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "../models/Customer";

const endpoints = {
    getAll: "Customer",
    getById: (id: string) => `Customer/${id}`,
    create: "Customer",
    update: (id: string) => `Customer/${id}`,
    delete: (id: string) => `Customer/${id}`,
    search: (term: string) => `Customer/search?term=${term}`,
};

export const useCustomerApi = () => {
    const { get, post, put, remove } = useHttpClient();

    const getAllCustomers = useCallback(async () => {
        return await get<Customer[]>(endpoints.getAll);
    }, [get]);

    const getCustomerById = useCallback(async (id: string) => {
        return await get<Customer>(endpoints.getById(id));
    }, [get]);

    const createCustomer = useCallback(async (customer: CreateCustomerRequest) => {
        return await post<CreateCustomerRequest, Customer>(endpoints.create, customer);
    }, [post]);

    const updateCustomer = useCallback(async (customer: UpdateCustomerRequest) => {
        return await put<UpdateCustomerRequest, void>(endpoints.update(customer.id), customer);
    }, [put]);

    const deleteCustomer = useCallback(async (id: string) => {
        return await remove<void>(endpoints.delete(id));
    }, [remove]);

    const searchCustomers = useCallback(async (term: string) => {
        return await get<Customer[]>(endpoints.search(term));
    }, [get]);

    return {
        getAllCustomers,
        getCustomerById,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        searchCustomers,
    };
};
