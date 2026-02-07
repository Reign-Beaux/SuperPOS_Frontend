import { useRoleApi } from "@/modules/roles/api/roleApi";
import type { CreateRoleRequest, Role, UpdateRoleRequest } from "@/modules/roles/models/Role";
import type { RoleFormValues } from "@/modules/roles/schemes/RoleScheme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ROLES_QUERY_KEY = ['roles'];

export const useRoleCatalogHandler = () => {
    const queryClient = useQueryClient();
    const { getAllRoles, createRole, updateRole, deleteRole } = useRoleApi();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

    // Query for fetching all roles
    const {
        data: roles = [],
        isLoading
    } = useQuery({
        queryKey: ROLES_QUERY_KEY,
        queryFn: getAllRoles,
    });

    // Mutation for creating roles
    const createMutation = useMutation({
        mutationFn: createRole,
        onSuccess: (newRole) => {
            queryClient.setQueryData<Role[]>(ROLES_QUERY_KEY, (old = []) => [...old, newRole]);
        },
    });

    // Mutation for updating roles
    const updateMutation = useMutation({
        mutationFn: updateRole,
        onSuccess: (_, variables) => {
            queryClient.setQueryData<Role[]>(ROLES_QUERY_KEY, (old = []) =>
                old.map(r => r.id === variables.id ? { ...r, ...variables } : r)
            );
        },
    });

    // Mutation for deleting roles
    const deleteMutation = useMutation({
        mutationFn: deleteRole,
        onMutate: async (roleId) => {
            await queryClient.cancelQueries({ queryKey: ROLES_QUERY_KEY });
            const previousRoles = queryClient.getQueryData<Role[]>(ROLES_QUERY_KEY);
            queryClient.setQueryData<Role[]>(ROLES_QUERY_KEY, (old = []) =>
                old.filter(r => r.id !== roleId)
            );
            return { previousRoles };
        },
        onError: (_err, _roleId, context) => {
            if (context?.previousRoles) {
                queryClient.setQueryData(ROLES_QUERY_KEY, context.previousRoles);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
        },
    });

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

        setIsDeleteConfirmOpen(false);
        const deletedId = roleToDelete;
        setRoleToDelete(null);

        try {
            await deleteMutation.mutateAsync(deletedId);
        } catch (error) {
            console.error("Failed to delete role", error);
        }
    };

    const handleSubmit = async (values: RoleFormValues) => {
        try {
            if (selectedRole) {
                const updateRequest: UpdateRoleRequest = {
                    id: selectedRole.id,
                    name: values.name,
                    description: values.description
                };
                await updateMutation.mutateAsync(updateRequest);
            } else {
                const createRequest: CreateRoleRequest = {
                    name: values.name,
                    description: values.description
                };
                await createMutation.mutateAsync(createRequest);
            }
            setIsSheetOpen(false);
        } catch (error) {
            console.error("Failed to save role", error);
        }
    };

    return {
        roles,
        isLoading: isLoading || createMutation.isPending || updateMutation.isPending,
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
