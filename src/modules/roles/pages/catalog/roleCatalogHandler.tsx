import { useRoleApi } from "@/modules/roles/api/roleApi";
import type { Role, CreateRoleRequest, UpdateRoleRequest } from "@/modules/roles/models/Role";
import type { RoleFormValues } from "@/modules/roles/schemes/RoleScheme";
import { useEffect, useState } from "react";

export const useRoleCatalogHandler = () => {
    const { getAllRoles, createRole, updateRole, deleteRole } = useRoleApi();

    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

    const loadRoles = async () => {
        setIsLoading(true);
        try {
            const data = await getAllRoles();
            setRoles(data);
        } catch (error) {
            if (error instanceof Error && error.message === "Request cancelled") return;
            console.error("Failed to load roles", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedRole(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setIsSheetOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setRoleToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!roleToDelete) return;

        try {
            await deleteRole(roleToDelete);
            await loadRoles();
            setIsDeleteConfirmOpen(false);
            setRoleToDelete(null);
        } catch (error) {
            console.error("Failed to delete role", error);
        }
    };

    const handleSubmit = async (values: RoleFormValues) => {
        setIsLoading(true);
        try {
            if (selectedRole) {
                const updateRequest: UpdateRoleRequest = {
                    id: selectedRole.id,
                    name: values.name,
                    description: values.description
                };
                await updateRole(updateRequest);
            } else {
                const createRequest: CreateRoleRequest = {
                    name: values.name,
                    description: values.description
                };
                await createRole(createRequest);
            }
            setIsSheetOpen(false);
            await loadRoles();
        } catch (error) {
            console.error("Failed to save role", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    return {
        roles,
        isLoading,
        isSheetOpen,
        selectedRole,
        isDeleteConfirmOpen,
        setIsSheetOpen,
        setIsDeleteConfirmOpen,
        handleCreate,
        handleEdit,
        handleDeleteClick,
        handleConfirmDelete,
        handleSubmit
    };
};
