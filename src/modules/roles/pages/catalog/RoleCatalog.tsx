import { Button } from "@/components/elements/button";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { DataTable } from "@/components/widgets/DataTable";
import { FormSheet } from "@/components/widgets/FormSheet";
import { PageHeader } from "@/components/widgets/PageHeader";
import { TableToolbar } from "@/components/widgets/TableToolbar";
import { useState } from "react";
import { getRoleColumns } from "./components/RoleColumns";
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

    const [searchTerm, setSearchTerm] = useState("");

    const filteredRoles = roles.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = getRoleColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    });

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

            <FormSheet
                title={selectedRole ? "Edit Role" : "Create Role"}
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            >
                <RoleForm
                    initialData={selectedRole ? { ...selectedRole, id: selectedRole.id } : undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsSheetOpen(false)}
                    isLoading={isLoading}
                />
            </FormSheet >

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
