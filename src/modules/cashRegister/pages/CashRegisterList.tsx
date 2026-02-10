import { Button } from "@/components/elements/button";
import { DataTable } from "@/components/widgets/DataTable";
import { PageHeader } from "@/components/widgets/PageHeader";
import { StatCard } from "@/components/widgets/StatCard";
import { useCashRegisterApi } from "@/modules/cashRegister/api/cashRegisterApi";
import type { CashRegister } from "@/modules/cashRegister/models/CashRegister";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CashRegisterList = () => {
    const { getAllCashRegisters } = useCashRegisterApi();
    const navigate = useNavigate();
    const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadCashRegisters = async () => {
            setIsLoading(true);
            try {
                const data = await getAllCashRegisters();
                setCashRegisters(data);
            } catch (error) {
                console.error("Failed to load cash registers", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCashRegisters();
    }, [getAllCashRegisters]);

    const totalDifference = cashRegisters.reduce((sum, cr) => sum + cr.difference, 0);
    const totalSales = cashRegisters.reduce((sum, cr) => sum + cr.totalSales, 0);

    const columns = [
        {
            header: "Date",
            cell: (cr: CashRegister) => new Date(cr.closingDate).toLocaleDateString(),
        },
        {
            header: "User",
            accessorKey: "userName" as keyof CashRegister,
        },
        {
            header: "Total Sales",
            className: "text-right",
            cell: (cr: CashRegister) => `$${cr.totalSales.toFixed(2)}`,
        },
        {
            header: "Transactions",
            className: "text-right",
            accessorKey: "totalTransactions" as keyof CashRegister,
        },
        {
            header: "Difference",
            className: "text-right",
            cell: (cr: CashRegister) => (
                <span className={cr.difference === 0 ? "text-green-600" : cr.difference > 0 ? "text-blue-600" : "text-destructive"}>
                    ${cr.difference.toFixed(2)}
                </span>
            ),
        },
    ];

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Cash Register"
                action={<Button onClick={() => navigate("/cash-register/create")}>New Cash Register</Button>}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Sales"
                    value={`$${totalSales.toFixed(2)}`}
                    icon={DollarSign}
                    variation="positive"
                    description="Total sales from all registers"
                />
                <StatCard
                    title="Total Difference"
                    value={`$${totalDifference.toFixed(2)}`}
                    icon={totalDifference >= 0 ? TrendingUp : TrendingDown}
                    variation={totalDifference >= 0 ? "positive" : "negative"}
                    description={totalDifference >= 0 ? "Surplus" : "Shortage"}
                />
            </div>

            {isLoading && cashRegisters.length === 0 ? (
                <div>Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={cashRegisters}
                    onRowClick={(cr) => navigate(`/cash-register/detail/${cr.id}`)}
                />
            )}
        </div>
    );
};

export default CashRegisterList;
