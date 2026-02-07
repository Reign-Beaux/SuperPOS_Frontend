import type { CreateProductRequest, Product, UpdateProductRequest } from "@/modules/products/models/Product";
import { useProductApi } from "@/modules/products/productApi";
import type { ProductFormValues } from "@/modules/products/schemes/ProductScheme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const PRODUCTS_QUERY_KEY = ['products'];

export const useCatalogHandler = () => {
    const queryClient = useQueryClient();
    const { getAllProducts, createProduct, updateProduct, deleteProduct } = useProductApi();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    // Query for fetching all products
    const {
        data: products = [],
        isLoading
    } = useQuery({
        queryKey: PRODUCTS_QUERY_KEY,
        queryFn: getAllProducts,
    });

    // Mutation for creating products
    const createMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: (newProduct) => {
            // Optimistic update: Add new product to cache
            queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (old = []) => [...old, newProduct]);
        },
    });

    // Mutation for updating products
    const updateMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: (_, variables) => {
            // Optimistic update: Update product in cache
            queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (old = []) =>
                old.map(p => p.id === variables.id ? { ...p, ...variables } : p)
            );
        },
    });

    // Mutation for deleting products
    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onMutate: async (productId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEY });

            // Snapshot previous value
            const previousProducts = queryClient.getQueryData<Product[]>(PRODUCTS_QUERY_KEY);

            // Optimistically update cache
            queryClient.setQueryData<Product[]>(PRODUCTS_QUERY_KEY, (old = []) =>
                old.filter(p => p.id !== productId)
            );

            return { previousProducts };
        },
        onError: (_err, _productId, context) => {
            // Revert on error
            if (context?.previousProducts) {
                queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        },
    });

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

        setIsDeleteConfirmOpen(false);
        const deletedId = productToDelete;
        setProductToDelete(null);

        try {
            await deleteMutation.mutateAsync(deletedId);
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    const handleSubmit = async (values: ProductFormValues) => {
        try {
            if (selectedProduct) {
                const updateRequest: UpdateProductRequest = {
                    id: selectedProduct.id,
                    name: values.name,
                    description: values.description ?? "",
                    barcode: values.barcode
                };
                await updateMutation.mutateAsync(updateRequest);
            } else {
                const createRequest: CreateProductRequest = {
                    name: values.name,
                    description: values.description ?? "",
                    barcode: values.barcode
                };
                await createMutation.mutateAsync(createRequest);
            }
            setIsSheetOpen(false);
        } catch (error) {
            console.error("Failed to save product", error);
        }
    };

    return {
        products,
        isLoading: isLoading || createMutation.isPending || updateMutation.isPending,
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
