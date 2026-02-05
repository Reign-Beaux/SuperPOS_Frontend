import { Button } from "@/components/elements/button";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { DataTable } from "@/components/widgets/DataTable";
import { FormSheet } from "@/components/widgets/FormSheet";
import { PageHeader } from "@/components/widgets/PageHeader";
import { TableToolbar } from "@/components/widgets/TableToolbar";
import { useState } from "react";
import { getUserColumns } from "./components/UserColumns";
import { UserForm } from "./components/UserForm";
import { useCatalogHandler } from "./userCatalogHandler";

const UserCatalog = () => {
    const {
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
    } = useCatalogHandler();

    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.firstLastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = getUserColumns({
        user: {} as any,
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    });

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Users"
                action={<Button onClick={handleCreate}>Create User</Button>}
            />

            <div className="space-y-4">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Filter users..."
                />

                {isLoading && users.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={filteredUsers} />
                )}
            </div>

            <FormSheet
                title={selectedUser ? "Edit User" : "Create User"}
                description={selectedUser ? "Update the user's details below." : "Enter the details for the new user."}
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            >
                <UserForm
                    initialData={selectedUser ? {
                        id: selectedUser.id,
                        name: selectedUser.name,
                        firstLastname: selectedUser.firstLastname,
                        secondLastname: selectedUser.secondLastname,
                        email: selectedUser.email,
                        phone: selectedUser.phone,
                        roleId: selectedUser.role?.id || ""
                    } : undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsSheetOpen(false)}
                    isLoading={isLoading}
                />
            </FormSheet>

            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                variant="destructive"
                confirmText="Delete"
            />
        </div>
    );
};

export default UserCatalog;
