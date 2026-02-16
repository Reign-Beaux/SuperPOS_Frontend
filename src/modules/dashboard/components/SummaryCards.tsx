import { StatCard } from "@/components/widgets/StatCard";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import type { PeriodSummary } from "../models/Dashboard";

interface SummaryCardsProps {
    summary: PeriodSummary;
}

export const SummaryCards = ({ summary }: SummaryCardsProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Ventas Totales"
                value={formatCurrency(summary.totalRevenue)}
                icon={DollarSign}
                variation="positive"
                description={`${summary.totalSales} transacciones`}
            />
            <StatCard
                title="Ticket Promedio"
                value={formatCurrency(summary.averageTicketSize)}
                icon={ShoppingCart}
                variation="neutral"
            />
            <StatCard
                title="Items Vendidos"
                value={summary.totalItemsSold}
                icon={Package}
                variation="neutral"
            />
            <StatCard
                title="Clientes Únicos"
                value={summary.totalCustomers}
                icon={Users}
                variation="neutral"
            />
        </div>
    );
};
