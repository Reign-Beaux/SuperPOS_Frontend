import { Card, CardContent, CardHeader, CardTitle } from "@/components/elements/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { DashboardComparison } from "../models/Dashboard";

interface ComparisonMetricsProps {
    comparison: DashboardComparison;
}

export const ComparisonMetrics = ({ comparison }: ComparisonMetricsProps) => {
    const renderChange = (percent: number) => {
        if (percent > 0) {
            return (
                <div className="flex items-center text-green-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>{percent.toFixed(2)}%</span>
                </div>
            );
        }
        if (percent < 0) {
            return (
                <div className="flex items-center text-red-600">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span>{Math.abs(percent).toFixed(2)}%</span>
                </div>
            );
        }
        return (
            <div className="flex items-center text-muted-foreground">
                <Minus className="h-4 w-4 mr-1" />
                <span>0.00%</span>
            </div>
        );
    };

    const metrics = [
        { label: "Ingresos", value: comparison.revenueChangePercent },
        { label: "Ventas", value: comparison.salesChangePercent },
        { label: "Ticket Promedio", value: comparison.averageTicketChangePercent },
        { label: "Items Vendidos", value: comparison.itemsSoldChangePercent },
        { label: "Clientes", value: comparison.customersChangePercent },
    ];

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Crecimiento (vs Período Ant.)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {metrics.map((metric) => (
                        <div key={metric.label} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{metric.label}</span>
                            {renderChange(metric.value)}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
