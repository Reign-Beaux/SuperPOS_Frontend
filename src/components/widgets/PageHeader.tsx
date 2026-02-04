import type { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    action?: ReactNode;
}

export const PageHeader = ({ title, action }: PageHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {action && <div>{action}</div>}
        </div>
    );
};
