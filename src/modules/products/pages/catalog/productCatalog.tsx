import { Button } from "@/components/elements/button";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { DataTable } from "@/components/widgets/DataTable";
import { FormSheet } from "@/components/widgets/FormSheet";
import { PageHeader } from "@/components/widgets/PageHeader";
import { TableToolbar } from "@/components/widgets/TableToolbar";
import { useState } from "react";
import { getProductColumns } from "./components/ProductColumns";
import { ProductForm } from "./components/ProductForm";
import { useCatalogHandler } from "./productCatalogHandler";

const ProductCatalog = () => {
    const {
        products,
        isLoading,
        isSheetOpen,
        selectedProduct,
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

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchTerm))
    );

    const columns = getProductColumns({
        product: {} as any,
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    });

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Products"
                action={<Button onClick={handleCreate}>Create Product</Button>}
            />

            <div className="space-y-4">
                <TableToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Filter products..."
                />

                {isLoading && products.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={filteredProducts} />
                )}
            </div>

            <FormSheet
                title={selectedProduct ? "Edit Product" : "Create Product"}
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            >
                <ProductForm
                    initialData={selectedProduct ? { ...selectedProduct, id: selectedProduct.id } : undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsSheetOpen(false)}
                    isLoading={isLoading}
                />
            </FormSheet>

            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                variant="destructive"
                confirmText="Delete"
            />
        </div>
    );
};

export default ProductCatalog;
