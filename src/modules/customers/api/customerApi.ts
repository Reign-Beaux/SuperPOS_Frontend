import { useHttpClient } from "@/config/httpClient";
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "../models/Customer";

const endpoints = {
    getAll: "Customer",
    getById: (id: string) => `Customer/${id}`,
    create: "Customer",
    update: (id: string) => `Customer/${id}`,
    delete: (id: string) => `Customer/${id}`,
};

export const useCustomerApi = () => {
    const { get, post, put, remove } = useHttpClient();

    const getAllCustomers = async () => {
        return await get<Customer[]>(endpoints.getAll);
    };

    const getCustomerById = async (id: string) => {
        return await get<Customer>(endpoints.getById(id));
    };

    const createCustomer = async (customer: CreateCustomerRequest) => {
        return await post<CreateCustomerRequest, Customer>(endpoints.create, customer);
    };

    const updateCustomer = async (customer: UpdateCustomerRequest) => {
        const { id, ...data } = customer;
        return await put<Omit<UpdateCustomerRequest, 'id'>, void>(endpoints.update(id), data);
    };

    const deleteCustomer = async (id: string) => {
        return await remove<void>(endpoints.delete(id));
    };

    return {
        getAllCustomers,
        getCustomerById,
        createCustomer,
        updateCustomer,
        deleteCustomer,
    };
};
