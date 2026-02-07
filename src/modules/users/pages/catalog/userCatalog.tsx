import { Button } from "@/components/elements/button";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { DataTable } from "@/components/widgets/DataTable";
import { PageHeader } from "@/components/widgets/PageHeader";
import { TableToolbar } from "@/components/widgets/TableToolbar";
import { lazy, Suspense, useMemo, useState } from "react";
import { getUserColumns } from "./components/UserColumns";
import { useCatalogHandler } from "./userCatalogHandler";

// Lazy load heavy components
const FormSheet = lazy(() => import("@/components/widgets/FormSheet").then(m => ({ default: m.FormSheet })));
const UserForm = lazy(() => import("./components/UserForm").then(m => ({ default: m.UserForm })));

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

    // Memoize filtered users to prevent re-calculation on every render
    const filteredUsers = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return users.filter(u =>
            u.name.toLowerCase().includes(searchLower) ||
            u.firstLastname.toLowerCase().includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower)
        );
    }, [users, searchTerm]);

    // Memoize columns to prevent recreation on every render
    const columns = useMemo(() => getUserColumns({
        user: {} as any,
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    }), [handleEdit, handleDeleteClick]);

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

            <Suspense fallback={<div className="p-4">Loading...</div>}>
                <FormSheet
                    title={selectedUser ? "Edit User" : "Create User"}
                    description={selectedUser ? "Update the user's details below." : "Enter the details for the new user."}
                    isOpen={isSheetOpen}
                    onClose={() => setIsSheetOpen(false)}
                >
                    <UserForm
                        key={selectedUser?.id || 'new'}
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
            </Suspense>

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
