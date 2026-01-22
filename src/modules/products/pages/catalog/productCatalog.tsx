import { Button } from "@/components/elements/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/elements/sheet";
import { ConfirmDialog } from "@/components/widgets/ConfirmDialog";
import { getProductColumns } from "./components/ProductColumns";
import { ProductDataTable } from "./components/ProductDataTable";
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

    const columns = getProductColumns({
        product: {} as any, // This prop is not used in column definition generation logic specifically but required by interface
        onEdit: handleEdit,
        onDelete: handleDeleteClick
    });

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <Button onClick={handleCreate}>Create Product</Button>
            </div>

            {isLoading && products.length === 0 ? (
                <div>Loading...</div>
            ) : (
                <ProductDataTable columns={columns} data={products} />
            )}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{selectedProduct ? "Edit Product" : "Create Product"}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <ProductForm
                            initialData={selectedProduct ? { ...selectedProduct, id: selectedProduct.id } : undefined}
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
