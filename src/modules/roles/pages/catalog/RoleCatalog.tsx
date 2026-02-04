import { Button } from "@/components/elements/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/elements/sheet";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { getRoleColumns } from "./components/RoleColumns";
import { DataTable } from "@/components/widgets/DataTable";
import { RoleForm } from "./components/RoleForm";
import { useRoleCatalogHandler } from "./roleCatalogHandler";

const RoleCatalog = () => {
    const {
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
    } = useRoleCatalogHandler();

    const columns = getRoleColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    });

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
                <Button onClick={handleCreate}>Create Role</Button>
            </div>

            {isLoading && roles.length === 0 ? (
                <div>Loading...</div>
            ) : (
                <DataTable columns={columns} data={roles} />
            )}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{selectedRole ? "Edit Role" : "Create Role"}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <RoleForm
                            initialData={selectedRole ? { ...selectedRole, id: selectedRole.id } : undefined}
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
                title="Delete Role"
                description="Are you sure you want to delete this role? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                variant="destructive"
                confirmText="Delete"
            />
        </div>
    );
};

export default RoleCatalog;
