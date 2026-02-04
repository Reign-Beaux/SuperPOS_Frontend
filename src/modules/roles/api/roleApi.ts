import { useHttpClient } from "@/config/httpClient";
import type { Role, CreateRoleRequest, UpdateRoleRequest } from "../models/Role";

const endpoints = {
    getAll: "Role",
    getById: (id: string) => `Role/${id}`,
    create: "Role",
    update: (id: string) => `Role/${id}`,
    delete: (id: string) => `Role/${id}`,
};

export const useRoleApi = () => {
    const { get, post, put, remove } = useHttpClient();

    const getAllRoles = async () => {
        return await get<Role[]>(endpoints.getAll);
    };

    const getRoleById = async (id: string) => {
        return await get<Role>(endpoints.getById(id));
    };

    const createRole = async (role: CreateRoleRequest) => {
        return await post<CreateRoleRequest, Role>(endpoints.create, role);
    };

    const updateRole = async (role: UpdateRoleRequest) => {
        const { id, ...data } = role;
        return await put<Omit<UpdateRoleRequest, 'id'>, void>(endpoints.update(id), data);
    };

    const deleteRole = async (id: string) => {
        return await remove<void>(endpoints.delete(id));
    };

    return {
        getAllRoles,
        getRoleById,
        createRole,
        updateRole,
        deleteRole,
    };
};
