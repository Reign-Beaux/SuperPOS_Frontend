import { Button } from "@/components/elements/button";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { DataTable } from "@/components/widgets/DataTable";
import { FormSheet } from "@/components/widgets/FormSheet";
import { PageHeader } from "@/components/widgets/PageHeader";
import { TableToolbar } from "@/components/widgets/TableToolbar";
import { useState, useMemo } from "react";
import { getCustomerColumns } from "./components/CustomerColumns";
import { CustomerForm } from "./components/CustomerForm";
import { useCustomerCatalogHandler } from "./customerCatalogHandler";

const CustomerCatalog = () => {
    const {
        customers,
        isLoading,
        isSheetOpen,
        selectedCustomer,
        isDeleteConfirmOpen,
        setIsSheetOpen,
        setIsDeleteConfirmOpen,
        handleCreate,
        handleEdit,
        handleDeleteClick,
        handleConfirmDelete,
        handleSubmit
    } = useCustomerCatalogHandler();

    const [searchTerm, setSearchTerm] = useState("");

    // Memoize filtered customers to prevent re-calculation on every render
    const filteredCustomers = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return customers.filter(c =>
            c.name.toLowerCase().includes(searchLower) ||
            c.firstLastname.toLowerCase().includes(searchLower) ||
            (c.email?.toLowerCase().includes(searchLower) ?? false)
        );
    }, [customers, searchTerm]);

    // Memoize columns to prevent recreation on every render
    const columns = useMemo(() => getCustomerColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    }), [handleEdit, handleDeleteClick]);

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Customers"
                action={<Button onClick={handleCreate}>Create Customer</Button>}
            />

            <div className="space-y-4">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Filter customers..."
                />

                {(isLoading && customers.length === 0) ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={filteredCustomers} />
                )}
            </div>

            <FormSheet
                title={selectedCustomer ? "Edit Customer" : "Create Customer"}
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            >
                <CustomerForm
                    key={selectedCustomer?.id || 'new'}
                    initialData={selectedCustomer ? { ...selectedCustomer, id: selectedCustomer.id } : undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsSheetOpen(false)}
                    isLoading={isLoading}
                />
            </FormSheet>

            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                title="Delete Customer"
                description="Are you sure you want to delete this customer? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                variant="destructive"
                confirmText="Delete"
            />
        </div>
    );
};

export default CustomerCatalog;
