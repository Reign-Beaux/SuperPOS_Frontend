import type { Customer } from "@/modules/customers/models/Customer";
import type { ReactNode } from "react";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
    className?: string;
}

interface ActionsProps {
    onEdit: (customer: Customer) => void;
    onDelete: (id: string) => void;
}

export const getCustomerColumns = ({ onEdit, onDelete }: ActionsProps): Column<Customer>[] => [
    {
        header: "Name",
        cell: (customer) => `${customer.name} ${customer.firstLastname} ${customer.secondLastname || ''}`,
    },
    {
        header: "Email",
        accessorKey: "email",
    },
    {
        header: "Phone",
        accessorKey: "phone",
    },
    {
        header: "",
        className: "text-right",
        cell: (customer) => (
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => onEdit(customer)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(customer.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                    Delete
                </button>
            </div>
        ),
    },
];
