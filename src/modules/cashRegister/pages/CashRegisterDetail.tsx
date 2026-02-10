import { Button } from "@/components/elements/button";
import { PageHeader } from "@/components/widgets/PageHeader";
import { useCashRegisterApi } from "@/modules/cashRegister/api/cashRegisterApi";
import type { CashRegister } from "@/modules/cashRegister/models/CashRegister";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CashRegisterDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCashRegisterById, downloadCashRegisterReport } = useCashRegisterApi();

    const [cashRegister, setCashRegister] = useState<CashRegister | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const loadCashRegister = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await getCashRegisterById(id);
                setCashRegister(data);
            } catch (error) {
                console.error("Failed to load cash register", error);
                toast.error("Failed to load cash register details");
                navigate("/cash-register");
            } finally {
                setIsLoading(false);
            }
        };
        loadCashRegister();
    }, [id, getCashRegisterById, navigate]);

    const handleDownloadReport = async () => {
        if (!id) return;
        setIsDownloading(true);
        try {
            await downloadCashRegisterReport(id);
            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error("Failed to download report", error);
            toast.error("Failed to download report");
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!cashRegister) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center">Cash register not found</div>
            </div>
        );
    }

    const expectedCash = cashRegister.initialCash + cashRegister.totalSales;
    const averageTicket = cashRegister.totalTransactions > 0 
        ? cashRegister.totalSales / cashRegister.totalTransactions 
        : 0;

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Cash Register Detail"
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate("/cash-register")}>
                            Back to List
                        </Button>
                        <Button onClick={handleDownloadReport} disabled={isDownloading}>
                            <Download className="mr-2 h-4 w-4" />
                            {isDownloading ? "Downloading..." : "Download Report"}
                        </Button>
                    </div>
                }
            />

            <div className="grid gap-6 md:grid-cols-2">
                <div className="border rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold">General Information</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono text-sm">{cashRegister.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Cashier:</span>
                            <span className="font-medium">{cashRegister.userName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Opening Date:</span>
                            <span>{new Date(cashRegister.openingDate).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Closing Date:</span>
                            <span>{new Date(cashRegister.closingDate).toLocaleString()}</span>
                        </div>
                        {cashRegister.notes && (
                            <div className="pt-2 border-t">
                                <span className="text-muted-foreground block mb-1">Notes:</span>
                                <p className="text-sm">{cashRegister.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Financial Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Initial Cash:</span>
                            <span>${cashRegister.initialCash.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Sales:</span>
                            <span>${cashRegister.totalSales.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-2">
                            <span className="text-muted-foreground">Expected Cash:</span>
                            <span>${expectedCash.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Final Cash:</span>
                            <span>${cashRegister.finalCash.toFixed(2)}</span>
                        </div>
                        <div className={`flex justify-between text-lg font-bold border-t pt-2 ${cashRegister.difference === 0 ? "text-green-600" : cashRegister.difference > 0 ? "text-blue-600" : "text-destructive"}`}>
                            <span>Difference:</span>
                            <span>${cashRegister.difference.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">Statistics</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold">{cashRegister.totalTransactions}</p>
                        <p className="text-sm text-muted-foreground">Total Transactions</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold">{cashRegister.totalItemsSold}</p>
                        <p className="text-sm text-muted-foreground">Items Sold</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold">${averageTicket.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Average Ticket</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashRegisterDetail;
