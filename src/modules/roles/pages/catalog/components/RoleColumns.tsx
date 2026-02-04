import type { Role } from "@/modules/roles/models/Role";
import type { ReactNode } from "react";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
    className?: string;
}

interface ActionsProps {
    onEdit: (role: Role) => void;
    onDelete: (id: string) => void;
}

export const getRoleColumns = ({ onEdit, onDelete }: ActionsProps): Column<Role>[] => [
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Description",
        accessorKey: "description",
    },
    {
        header: "",
        className: "text-right",
        cell: (role) => (
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => onEdit(role)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(role.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                    Delete
                </button>
            </div>
        ),
    },
];
