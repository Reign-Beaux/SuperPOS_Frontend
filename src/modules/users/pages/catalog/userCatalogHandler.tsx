import type { CreateUserRequest, UpdateUserRequest, User } from "@/modules/users/models/User";
import type { UserFormValues } from "@/modules/users/schemes/UserScheme";
import { useUserApi } from "@/modules/users/userApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const USERS_QUERY_KEY = ['users'];

export const useCatalogHandler = () => {
    const queryClient = useQueryClient();
    const { getAllUsers, createUser, updateUser, deleteUser } = useUserApi();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    // Query for fetching all users
    const {
        data: users = [],
        isLoading
    } = useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: getAllUsers,
    });

    // Mutation for creating users
    const createMutation = useMutation({
        mutationFn: createUser,
        onSuccess: (newUser) => {
            queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old = []) => [...old, newUser]);
        },
    });

    // Mutation for updating users
    const updateMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: (_, variables) => {
            queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old = []) =>
                old.map(u => u.id === variables.id ? { ...u, ...variables } : u)
            );
        },
    });

    // Mutation for deleting users
    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onMutate: async (userId) => {
            await queryClient.cancelQueries({ queryKey: USERS_QUERY_KEY });
            const previousUsers = queryClient.getQueryData<User[]>(USERS_QUERY_KEY);
            queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old = []) =>
                old.filter(u => u.id !== userId)
            );
            return { previousUsers };
        },
        onError: (_err, _userId, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(USERS_QUERY_KEY, context.previousUsers);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });

    const handleCreate = () => {
        setSelectedUser(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsSheetOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setUserToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        setIsDeleteConfirmOpen(false);
        const deletedId = userToDelete;
        setUserToDelete(null);

        try {
            await deleteMutation.mutateAsync(deletedId);
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const handleSubmit = async (values: UserFormValues) => {
        try {
            if (selectedUser) {
                const updateRequest: UpdateUserRequest = {
                    id: selectedUser.id,
                    name: values.name,
                    firstLastname: values.firstLastname,
                    secondLastname: values.secondLastname,
                    email: values.email,
                    phone: values.phone,
                    roleId: values.roleId,
                    password: values.password || undefined
                };
                await updateMutation.mutateAsync(updateRequest);
            } else {
                const createRequest: CreateUserRequest = {
                    name: values.name,
                    firstLastname: values.firstLastname,
                    secondLastname: values.secondLastname,
                    email: values.email,
                    phone: values.phone,
                    roleId: values.roleId,
                    password: values.password || ""
                };
                await createMutation.mutateAsync(createRequest);
            }
            setIsSheetOpen(false);
        } catch (error) {
            console.error("Failed to save user", error);
        }
    };

    return {
        users,
        isLoading: isLoading || createMutation.isPending || updateMutation.isPending,
        isSheetOpen,
        selectedUser,
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
