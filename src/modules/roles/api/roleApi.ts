import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
import type { CreateRoleRequest, Role, UpdateRoleRequest } from "../models/Role";

const endpoints = {
    getAll: "Role",
    getById: (id: string) => `Role/${id}`,
    create: "Role",
    update: (id: string) => `Role/${id}`,
    delete: (id: string) => `Role/${id}`,
};

export const useRoleApi = () => {
    const { get, post, put, remove } = useHttpClient();

    const getAllRoles = useCallback(async () => {
        return await get<Role[]>(endpoints.getAll);
    }, [get]);

    const getRoleById = useCallback(async (id: string) => {
        return await get<Role>(endpoints.getById(id));
    }, [get]);

    const createRole = useCallback(async (role: CreateRoleRequest) => {
        return await post<CreateRoleRequest, Role>(endpoints.create, role);
    }, [post]);

    const updateRole = useCallback(async (role: UpdateRoleRequest) => {
        const { id, ...data } = role;
        return await put<Omit<UpdateRoleRequest, 'id'>, void>(endpoints.update(id), data);
    }, [put]);

    const deleteRole = useCallback(async (id: string) => {
        return await remove<void>(endpoints.delete(id));
    }, [remove]);

    return {
        getAllRoles,
        getRoleById,
        createRole,
        updateRole,
        deleteRole,
    };
};
