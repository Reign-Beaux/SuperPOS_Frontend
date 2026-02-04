import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    variation?: "neutral" | "positive" | "negative";
}

export const StatCard = ({ title, value, icon: Icon, description, variation = "neutral" }: StatCardProps) => {
    const variationClasses = {
        neutral: "text-muted-foreground",
        positive: "text-green-600",
        negative: "text-red-600"
    };

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow mb-2">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{title}</h3>
                <Icon className={`h-4 w-4 ${variationClasses[variation]}`} />
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </div>
        </div>
    );
};
