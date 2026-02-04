import { Button } from "@/components/elements/button";
import { DataTable } from "@/components/widgets/DataTable";
import { PageHeader } from "@/components/widgets/PageHeader";
import { StatCard } from "@/components/widgets/StatCard";
import { useSaleApi } from "@/modules/sales/api/saleApi";
import type { Sale } from "@/modules/sales/models/Sale";
import { DollarSign, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const SalesHistory = () => {
    const { getAllSales } = useSaleApi();
    const navigate = useNavigate();
    const [sales, setSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadSales = async () => {
            setIsLoading(true);
            try {
                const data = await getAllSales();
                setSales(data);
            } catch (error) {
                console.error("Failed to load sales", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSales();
    }, []);

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalSalesCount = sales.length;

    const columns = [
        {
            header: "Date",
            cell: (sale: Sale) => new Date(sale.createdAt).toLocaleString(),
        },
        {
            header: "Customer",
            accessorKey: "customerName" as keyof Sale,
        },
        {
            header: "User",
            accessorKey: "userName" as keyof Sale,
        },
        {
            header: "Total",
            className: "text-right",
            cell: (sale: Sale) => `$${sale.totalAmount.toFixed(2)}`,
        },
        {
            header: "Items",
            className: "text-right",
            cell: (sale: Sale) => sale.details.length,
        }
    ];

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Sales History"
                action={<Button onClick={() => navigate("/sales/pos")}>New Sale (POS)</Button>}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    variation="positive"
                    description="Gross revenue from all sales"
                />
                <StatCard
                    title="Total Sales"
                    value={totalSalesCount}
                    icon={ShoppingBag}
                    description="Total transactions"
                />
            </div>

            {isLoading && sales.length === 0 ? (
                <div>Loading...</div>
            ) : (
                <DataTable columns={columns} data={sales} />
            )}
        </div>
    );
};

export default SalesHistory;
