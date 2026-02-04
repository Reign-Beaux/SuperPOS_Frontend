import { Button } from "@/components/elements/button";
import { useSaleApi } from "@/modules/sales/api/saleApi";
import type { Sale } from "@/modules/sales/models/Sale";
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

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Sales History</h1>
                <Button onClick={() => navigate("/sales/pos")}>New Sale (POS)</Button>
            </div>

            <div className="rounded-md border">
                <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                        <tr>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="h-24 text-center">Loading...</td>
                            </tr>
                        ) : sales.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="h-24 text-center">No sales found.</td>
                            </tr>
                        ) : (
                            sales.map((sale) => (
                                <tr key={sale.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">{new Date(sale.createdAt).toLocaleString()}</td>
                                    <td className="p-4 align-middle">{sale.customerName}</td>
                                    <td className="p-4 align-middle">{sale.userName}</td>
                                    <td className="p-4 align-middle text-right">${sale.totalAmount.toFixed(2)}</td>
                                    <td className="p-4 align-middle text-right">{sale.details.length}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesHistory;
