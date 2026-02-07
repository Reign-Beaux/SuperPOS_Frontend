import type { CreateUserRequest, UpdateUserRequest, User } from "@/modules/users/models/User";
import type { UserFormValues } from "@/modules/users/schemes/UserScheme";
import { useUserApi } from "@/modules/users/userApi";
import { useEffect, useState } from "react";

export const useCatalogHandler = () => {
    const { getAllUsers, createUser, updateUser, deleteUser } = useUserApi();

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            if (error instanceof Error && error.message === "Request cancelled") return;
            console.error("Failed to load users", error);
        } finally {
            setIsLoading(false);
        }
    };

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

        // Optimistic update: Update UI immediately
        const previousUsers = users;
        setUsers(prev => prev.filter(u => u.id !== userToDelete));
        setIsDeleteConfirmOpen(false);
        const deletedId = userToDelete;
        setUserToDelete(null);

        try {
            await deleteUser(deletedId);
            // Success - no need to reload, UI already updated
        } catch (error) {
            console.error("Failed to delete user", error);
            // Revert on error
            setUsers(previousUsers);
        }
    };

    const handleSubmit = async (values: UserFormValues) => {
        setIsLoading(true);
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
                await updateUser(updateRequest);
                // Update local state instead of reloading
                setUsers(prev => prev.map(u =>
                    u.id === selectedUser.id
                        ? { ...u, ...updateRequest }
                        : u
                ));
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
                const newUser = await createUser(createRequest);
                // Add to local state
                setUsers(prev => [...prev, newUser]);
            }
            setIsSheetOpen(false);
        } catch (error) {
            console.error("Failed to save user", error);
            // On error, reload to ensure consistency
            await loadUsers();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return {
        users,
        isLoading,
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
