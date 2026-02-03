import { Button } from "@/components/elements/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/elements/sheet";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { getUserColumns } from "./components/UserColumns";
import { UserDataTable } from "./components/UserDataTable";
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

    const columns = getUserColumns({
        user: {} as any,
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    });

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <Button onClick={handleCreate}>Create User</Button>
            </div>

            {isLoading && users.length === 0 ? (
                <div>Loading...</div>
            ) : (
                <UserDataTable columns={columns} data={users} />
            )}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{selectedUser ? "Edit User" : "Create User"}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <UserForm
                            initialData={selectedUser ? { ...selectedUser, id: selectedUser.id } : undefined}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsSheetOpen(false)}
                            isLoading={isLoading}
                        />
                    </div>
                </SheetContent>
            </Sheet>

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
