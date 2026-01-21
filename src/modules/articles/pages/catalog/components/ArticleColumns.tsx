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
        header: "Actions",
        className: "text-right",
        cell: (article) => (
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => onEdit(article)}
                    className="text-sm font-medium text-blue-600 hover:underline"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(article.id)}
                    className="text-sm font-medium text-red-600 hover:underline"
                >
                    Delete
                </button>
            </div>
        ),
    },
];
