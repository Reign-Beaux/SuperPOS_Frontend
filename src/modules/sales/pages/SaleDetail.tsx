import { Button } from "@/components/elements/button";
import { PageHeader } from "@/components/widgets/PageHeader";
import { useSaleApi } from "@/modules/sales/api/saleApi";
import type { Sale } from "@/modules/sales/models/Sale";
import { AlertCircle, Download, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/elements/dialog";
import { Input } from "@/components/elements/input";
import { Textarea } from "@/components/elements/textarea";
import { Label } from "@/components/elements/label";

const SaleDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getSaleById, downloadTicketPdf, cancelSale } = useSaleApi();

    const [sale, setSale] = useState<Sale | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelUserId, setCancelUserId] = useState("");

    useEffect(() => {
        const loadSale = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await getSaleById(id);
                setSale(data);
            } catch (error) {
                console.error("Failed to load sale", error);
                toast.error("Failed to load sale details");
                navigate("/sales");
            } finally {
                setIsLoading(false);
            }
        };
        loadSale();
    }, [id, getSaleById, navigate]);

    const handleDownloadTicket = async () => {
        if (!id) return;
        setIsDownloading(true);
        try {
            await downloadTicketPdf(id);
            toast.success("Ticket downloaded successfully");
        } catch (error) {
            console.error("Failed to download ticket", error);
            toast.error("Failed to download ticket");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCancelSale = async () => {
        if (!id || !cancelUserId || !cancelReason) {
            toast.error("Please provide user ID and cancellation reason");
            return;
        }

        setIsCancelling(true);
        try {
            await cancelSale(id, cancelUserId, cancelReason);
            // Reload the sale to get complete data
            const refreshedSale = await getSaleById(id);
            setSale(refreshedSale);
            setShowCancelDialog(false);
            setCancelReason("");
            setCancelUserId("");
            toast.success("Sale cancelled successfully");
        } catch (error) {
            console.error("Failed to cancel sale", error);
            toast.error("Failed to cancel sale");
        } finally {
            setIsCancelling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!sale) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center">Sale not found</div>
            </div>
        );
    }

    const totalAmount = sale.totalAmount ?? 0;
    const subtotal = totalAmount / 1.16;
    const iva = totalAmount - subtotal;

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Sale Detail"
                action={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/sales")}
                        >
                            Back to History
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleDownloadTicket}
                            disabled={isDownloading}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {isDownloading ? "Downloading..." : "Download Ticket"}
                        </Button>
                        {!sale.isCancelled && (
                            <Button
                                variant="destructive"
                                onClick={() => setShowCancelDialog(true)}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Sale
                            </Button>
                        )}
                    </div>
                }
            />

            {sale.isCancelled && (
                <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-destructive">Sale Cancelled</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Cancelled on: {sale.cancelledAt ? new Date(sale.cancelledAt).toLocaleString() : "N/A"}
                        </p>
                        {sale.cancellationReason && (
                            <p className="text-sm text-muted-foreground">
                                Reason: {sale.cancellationReason}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <div className="border rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Sale Information</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Sale ID:</span>
                            <span className="font-mono text-sm">{sale.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{new Date(sale.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Customer:</span>
                            <span className="font-medium">{sale.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Seller:</span>
                            <span className="font-medium">{sale.userName}</span>
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Financial Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">IVA (16%):</span>
                            <span>${iva.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t pt-2">
                            <span>Total:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">Product</th>
                                <th className="text-right py-3 px-4">Quantity</th>
                                <th className="text-right py-3 px-4">Unit Price</th>
                                <th className="text-right py-3 px-4">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.details.map((detail) => (
                                <tr key={detail.id} className="border-b">
                                    <td className="py-3 px-4">{detail.productName}</td>
                                    <td className="text-right py-3 px-4">{detail.quantity}</td>
                                    <td className="text-right py-3 px-4">${detail.unitPrice.toFixed(2)}</td>
                                    <td className="text-right py-3 px-4 font-medium">${detail.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Sale</DialogTitle>
                        <DialogDescription>
                            This action will cancel the sale and restore the inventory. Please provide a reason for cancellation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="userId">User ID (who is cancelling)</Label>
                            <Input
                                id="userId"
                                placeholder="Enter your user ID"
                                value={cancelUserId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCancelUserId(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">Cancellation Reason</Label>
                            <Textarea
                                id="reason"
                                placeholder="Enter reason for cancellation"
                                value={cancelReason}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCancelReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                            disabled={isCancelling}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancelSale}
                            disabled={isCancelling || !cancelUserId || !cancelReason}
                        >
                            {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SaleDetail;
