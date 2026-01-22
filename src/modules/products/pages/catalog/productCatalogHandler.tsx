import { useProductApi } from "@/modules/products/productApi";
import type { Product, CreateProductRequest, UpdateProductRequest } from "@/modules/products/models/Product";
import type { ProductFormValues } from "@/modules/products/schemes/ProductScheme";
import { useEffect, useState } from "react";

export const useCatalogHandler = () => {
    const { getAllProducts, createProduct, updateProduct, deleteProduct } = useProductApi();

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            if (error instanceof Error && error.message === "Request cancelled") return;
            console.error("Failed to load products", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsSheetOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setProductToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await deleteProduct(productToDelete);
            await loadProducts();
            setIsDeleteConfirmOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    const handleSubmit = async (values: ProductFormValues) => {
        setIsLoading(true);
        try {
            if (selectedProduct) {
                const updateRequest: UpdateProductRequest = {
                    id: selectedProduct.id,
                    name: values.name,
                    description: values.description ?? "",
                    barcode: values.barcode
                };
                await updateProduct(updateRequest);
            } else {
                const createRequest: CreateProductRequest = {
                    name: values.name,
                    description: values.description ?? "",
                    barcode: values.barcode
                };
                await createProduct(createRequest);
            }
            setIsSheetOpen(false);
            await loadProducts();
        } catch (error) {
            console.error("Failed to save product", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return {
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
    };
};
