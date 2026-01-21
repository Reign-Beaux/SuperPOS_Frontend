import type { Article } from "@/modules/articles/models/Article";
import type { ReactNode } from "react";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
    className?: string;
}

interface ActionsProps {
    article: Article;
    onEdit: (article: Article) => void;
    onDelete: (id: string) => void;
}

export const getArticleColumns = ({ onEdit, onDelete }: ActionsProps): Column<Article>[] => [
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
        cell: (article) => (
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => onEdit(article)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(article.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                    Delete
                </button>
            </div>
        ),
    },
];
