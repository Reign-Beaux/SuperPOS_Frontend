import { Button } from "@/components/elements/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/elements/sheet";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { getCustomerColumns } from "./components/CustomerColumns";
import { DataTable } from "@/components/widgets/DataTable";
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

    const columns = getCustomerColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    });

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                <Button onClick={handleCreate}>Create Customer</Button>
            </div>

            {isLoading && customers.length === 0 ? (
                <div>Loading...</div>
            ) : (
                <DataTable columns={columns} data={customers} />
            )}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{selectedCustomer ? "Edit Customer" : "Create Customer"}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <CustomerForm
                            initialData={selectedCustomer ? { ...selectedCustomer, id: selectedCustomer.id } : undefined}
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
