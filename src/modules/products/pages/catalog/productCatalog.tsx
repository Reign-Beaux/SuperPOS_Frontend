import { Button } from "@/components/elements/button";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { DataTable } from "@/components/widgets/DataTable";
import { PageHeader } from "@/components/widgets/PageHeader";
import { TableToolbar } from "@/components/widgets/TableToolbar";
import { lazy, Suspense, useMemo, useState } from "react";
import { getProductColumns } from "./components/ProductColumns";
import { useCatalogHandler } from "./productCatalogHandler";

// Lazy load heavy components
const FormSheet = lazy(() => import("@/components/widgets/FormSheet").then(m => ({ default: m.FormSheet })));
const ProductForm = lazy(() => import("./components/ProductForm").then(m => ({ default: m.ProductForm })));

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

    // Memoize filtered products to prevent re-calculation on every render
    const filteredProducts = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            (p.barcode && p.barcode.includes(searchTerm))
        );
    }, [products, searchTerm]);

    // Memoize columns to prevent recreation on every render
    const columns = useMemo(() => getProductColumns({
        product: {} as any,
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    }), [handleEdit, handleDeleteClick]);

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

                {(isLoading && products.length === 0) ? (
                    <div>Loading...</div>
                ) : (
                    <DataTable columns={columns} data={filteredProducts} />
                )}
            </div>

            <Suspense fallback={<div className="p-4">Loading...</div>}>
                <FormSheet
                    title={selectedProduct ? "Edit Product" : "Create Product"}
                    isOpen={isSheetOpen}
                    onClose={() => setIsSheetOpen(false)}
                >
                    <ProductForm
                        key={selectedProduct?.id || 'new'}
                        initialData={selectedProduct ? { ...selectedProduct, id: selectedProduct.id } : undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsSheetOpen(false)}
                        isLoading={isLoading}
                    />
                </FormSheet>
            </Suspense>

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
