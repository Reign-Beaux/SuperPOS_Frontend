import type { Product } from "@/modules/products/models/Product";
import type { ReactNode } from "react";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
    className?: string;
}

interface ActionsProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export const getProductColumns = ({ onEdit, onDelete }: ActionsProps): Column<Product>[] => [
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Description",
        accessorKey: "description",
    },
    {
        header: "Barcode",
        accessorKey: "barcode",
    },
    {
        header: "",
        className: "text-right",
        cell: (product) => (
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => onEdit(product)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(product.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                    Delete
                </button>
            </div>
        ),
    },
];
