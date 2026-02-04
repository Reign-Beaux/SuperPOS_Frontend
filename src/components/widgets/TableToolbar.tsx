import { Input } from "@/components/elements/input";
import type { ReactNode } from "react";

interface TableToolbarProps {
    searchPlaceholder?: string;
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    children?: ReactNode; // For extra filters
}

export const TableToolbar = ({
    searchPlaceholder = "Filter...",
    searchTerm,
    onSearchChange,
    children
}: TableToolbarProps) => {
    return (
        <div className="flex items-center justify-between py-4">
            {onSearchChange && (
                <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className="max-w-sm"
                />
            )}
            <div className="flex items-center gap-2">
                {children}
            </div>
        </div>
    );
};
