import { useHttpClient } from "@/config/httpClient";
import type { User, CreateUserRequest, UpdateUserRequest } from "./models/User";

const endpoints = {
    getAll: "User",
    getById: (id: string) => `User/${id}`,
    create: "User",
    update: (id: string) => `User/${id}`,
    delete: (id: string) => `User/${id}`,
};

export const useUserApi = () => {
    const { get, post, put, remove } = useHttpClient();

    const getAllUsers = async () => {
        return await get<User[]>(endpoints.getAll);
    };

    const getUserById = async (id: string) => {
        return await get<User>(endpoints.getById(id));
    };

    const createUser = async (user: CreateUserRequest) => {
        return await post<CreateUserRequest, User>(endpoints.create, user);
    };

    const updateUser = async (user: UpdateUserRequest) => {
        const { id, ...data } = user;
        return await put<Omit<UpdateUserRequest, 'id'>, void>(endpoints.update(id), data);
    };

    const deleteUser = async (id: string) => {
        return await remove<void>(endpoints.delete(id));
    };

    return {
        getAllUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
    };
};
