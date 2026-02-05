import type { User } from "@modules/users/models/User";
import type { ReactNode } from "react";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
    className?: string;
}

interface ActionsProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
}

export const getUserColumns = ({ onEdit, onDelete }: ActionsProps): Column<User>[] => [
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "First Lastname",
        accessorKey: "firstLastname",
    },
    {
        header: "Second Lastname",
        accessorKey: "secondLastname",
    },
    {
        header: "Role",
        cell: (user) => user.role?.name || "-",
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
        cell: (user) => (
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => onEdit(user)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(user.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                    Delete
                </button>
            </div>
        ),
    },
];
