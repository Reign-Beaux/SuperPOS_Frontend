import { Button } from "@/components/elements/button";
import { DataTable } from "@/components/widgets/DataTable";
import { PageHeader } from "@/components/widgets/PageHeader";
import { useReturnApi } from "@/modules/returns/api/returnApi";
import type { Return } from "@/modules/returns/models/Return";
import { ReturnStatus } from "@/modules/returns/models/Return";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReturnsList = () => {
    const { getAllReturns } = useReturnApi();
    const navigate = useNavigate();
    const [returns, setReturns] = useState<Return[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<ReturnStatus | "all">("all");

    useEffect(() => {
        const loadReturns = async () => {
            setIsLoading(true);
            try {
                const data = await getAllReturns();
                setReturns(data);
            } catch (error) {
                console.error("Failed to load returns", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadReturns();
    }, [getAllReturns]);

    const filteredReturns = statusFilter === "all" 
        ? returns 
        : returns.filter(r => r.status === statusFilter);

    const getStatusLabel = (status: ReturnStatus) => {
        switch (status) {
            case ReturnStatus.Pending: return "Pending";
            case ReturnStatus.Approved: return "Approved";
            case ReturnStatus.Rejected: return "Rejected";
            default: return "Unknown";
        }
    };

    const getTypeLabel = (type: number) => {
        return type === 1 ? "Refund" : "Exchange";
    };

    const columns = [
        {
            header: "Date",
            cell: (ret: Return) => new Date(ret.createdAt).toLocaleDateString(),
        },
        {
            header: "Sale ID",
            cell: (ret: Return) => ret.saleId.substring(0, 8) + "...",
        },
        {
            header: "Type",
            cell: (ret: Return) => getTypeLabel(ret.type),
        },
        {
            header: "Total Refund",
            className: "text-right",
            cell: (ret: Return) => `$${ret.totalRefund.toFixed(2)}`,
        },
        {
            header: "Status",
            cell: (ret: Return) => {
                const status = getStatusLabel(ret.status);
                const colorClass = ret.status === ReturnStatus.Pending 
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : ret.status === ReturnStatus.Approved
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-destructive/10 text-destructive";
                
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                        {status}
                    </span>
                );
            },
        },
    ];

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Returns"
                action={<Button onClick={() => navigate("/returns/create")}>New Return</Button>}
            />

            <div className="flex gap-2">
                <Button 
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                >
                    All
                </Button>
                <Button 
                    variant={statusFilter === ReturnStatus.Pending ? "default" : "outline"}
                    onClick={() => setStatusFilter(ReturnStatus.Pending)}
                >
                    Pending
                </Button>
                <Button 
                    variant={statusFilter === ReturnStatus.Approved ? "default" : "outline"}
                    onClick={() => setStatusFilter(ReturnStatus.Approved)}
                >
                    Approved
                </Button>
                <Button 
                    variant={statusFilter === ReturnStatus.Rejected ? "default" : "outline"}
                    onClick={() => setStatusFilter(ReturnStatus.Rejected)}
                >
                    Rejected
                </Button>
            </div>

            {isLoading && filteredReturns.length === 0 ? (
                <div>Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredReturns}
                    onRowClick={(ret) => navigate(`/returns/detail/${ret.id}`)}
                />
            )}
        </div>
    );
};

export default ReturnsList;
