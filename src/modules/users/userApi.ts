import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
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

    const getAllUsers = useCallback(async () => {
        return await get<User[]>(endpoints.getAll);
    }, [get]);

    const getUserById = useCallback(async (id: string) => {
        return await get<User>(endpoints.getById(id));
    }, [get]);

    const createUser = useCallback(async (user: CreateUserRequest) => {
        return await post<CreateUserRequest, User>(endpoints.create, user);
    }, [post]);

    const updateUser = useCallback(async (user: UpdateUserRequest) => {
        return await put<UpdateUserRequest, void>(endpoints.update(user.id), user);
    }, [put]);

    const deleteUser = useCallback(async (id: string) => {
        return await remove<void>(endpoints.delete(id));
    }, [remove]);

    return {
        getAllUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
    };
};
