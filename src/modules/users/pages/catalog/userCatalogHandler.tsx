import { useUserApi } from "@/modules/users/userApi";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/modules/users/models/User";
import type { UserFormValues } from "@/modules/users/schemes/UserScheme";
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

        try {
            await deleteUser(userToDelete);
            await loadUsers();
            setIsDeleteConfirmOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("Failed to delete user", error);
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
                    phone: values.phone
                };
                await updateUser(updateRequest);
            } else {
                const createRequest: CreateUserRequest = {
                    name: values.name,
                    firstLastname: values.firstLastname,
                    secondLastname: values.secondLastname,
                    email: values.email,
                    phone: values.phone
                };
                await createUser(createRequest);
            }
            setIsSheetOpen(false);
            await loadUsers();
        } catch (error) {
            console.error("Failed to save user", error);
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
