import { Button } from "@/components/elements/button";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { DataTable } from "@/components/widgets/DataTable";
import { PageHeader } from "@/components/widgets/PageHeader";
import { TableToolbar } from "@/components/widgets/TableToolbar";
import { lazy, Suspense, useMemo, useState } from "react";
import { getRoleColumns } from "./components/RoleColumns";
import { useRoleCatalogHandler } from "./roleCatalogHandler";

// Lazy load heavy components
const FormSheet = lazy(() => import("@/components/widgets/FormSheet").then(m => ({ default: m.FormSheet })));
const RoleForm = lazy(() => import("./components/RoleForm").then(m => ({ default: m.RoleForm })));

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

    const [searchTerm, setSearchTerm] = useState("");

    // Memoize filtered roles to prevent re-calculation on every render
    const filteredRoles = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return roles.filter(r =>
            r.name.toLowerCase().includes(searchLower)
        );
    }, [roles, searchTerm]);

    // Memoize columns to prevent recreation on every render
    const columns = useMemo(() => getRoleColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    }), [handleEdit, handleDeleteClick]);

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Roles"
                action={<Button onClick={handleCreate}>Create Role</Button>}
            />

            <div className="space-y-4">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Filter roles..."
                />

                {isLoading && roles.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={filteredRoles} />
                )}
            </div>

            <Suspense fallback={<div className="p-4">Loading...</div>}>
                <FormSheet
                    title={selectedRole ? "Edit Role" : "Create Role"}
                    isOpen={isSheetOpen}
                    onClose={() => setIsSheetOpen(false)}
                >
                    <RoleForm
                        key={selectedRole?.id || 'new'}
                        initialData={selectedRole ? { ...selectedRole, id: selectedRole.id } : undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsSheetOpen(false)}
                        isLoading={isLoading}
                    />
                </FormSheet>
            </Suspense>

            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                title="Delete Role"
                description="Are you sure you want to delete this role? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                variant="destructive"
                confirmText="Delete"
            />
        </div >
    );
};

export default RoleCatalog;
