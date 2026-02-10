import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import { Label } from "@/components/elements/label";
import { Textarea } from "@/components/elements/textarea";
import { PageHeader } from "@/components/widgets/PageHeader";
import { useReturnApi } from "@/modules/returns/api/returnApi";
import type { Return } from "@/modules/returns/models/Return";
import { ReturnStatus } from "@/modules/returns/models/Return";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
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

const ReturnDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getReturnById, approveReturn, rejectReturn } = useReturnApi();

    const [returnData, setReturnData] = useState<Return | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [userId, setUserId] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const loadReturn = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await getReturnById(id);
                setReturnData(data);
            } catch (error) {
                console.error("Failed to load return", error);
                toast.error("Failed to load return details");
                navigate("/returns");
            } finally {
                setIsLoading(false);
            }
        };
        loadReturn();
    }, [id, getReturnById, navigate]);

    const handleApprove = async () => {
        if (!id || !userId) {
            toast.error("Please provide user ID");
            return;
        }

        setIsProcessing(true);
        try {
            const updated = await approveReturn(id, userId);
            setReturnData(updated);
            setShowApproveDialog(false);
            toast.success("Return approved successfully");
        } catch (error) {
            console.error("Failed to approve return", error);
            toast.error("Failed to approve return");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!id || !userId || !rejectionReason) {
            toast.error("Please provide user ID and rejection reason");
            return;
        }

        setIsProcessing(true);
        try {
            const updated = await rejectReturn(id, userId, rejectionReason);
            setReturnData(updated);
            setShowRejectDialog(false);
            toast.success("Return rejected successfully");
        } catch (error) {
            console.error("Failed to reject return", error);
            toast.error("Failed to reject return");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!returnData) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center">Return not found</div>
            </div>
        );
    }

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

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Return Detail"
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate("/returns")}>
                            Back to List
                        </Button>
                        {returnData.status === ReturnStatus.Pending && (
                            <>
                                <Button variant="default" onClick={() => setShowApproveDialog(true)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                </Button>
                                <Button variant="destructive" onClick={() => setShowRejectDialog(true)}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                </Button>
                            </>
                        )}
                    </div>
                }
            />

            {returnData.status === ReturnStatus.Approved && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-400">Return Approved</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Approved on: {returnData.approvedAt ? new Date(returnData.approvedAt).toLocaleString() : "N/A"}
                        </p>
                    </div>
                </div>
            )}

            {returnData.status === ReturnStatus.Rejected && (
                <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-destructive">Return Rejected</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Rejected on: {returnData.rejectedAt ? new Date(returnData.rejectedAt).toLocaleString() : "N/A"}
                        </p>
                        {returnData.rejectionReason && (
                            <p className="text-sm text-muted-foreground">
                                Reason: {returnData.rejectionReason}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {returnData.status === ReturnStatus.Pending && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">Pending Approval</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            This return is awaiting approval or rejection.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <div className="border rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Return Information</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Return ID:</span>
                            <span className="font-mono text-sm">{returnData.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Sale ID:</span>
                            <span className="font-mono text-sm">{returnData.saleId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{getTypeLabel(returnData.type)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium">{getStatusLabel(returnData.status)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Created:</span>
                            <span>{new Date(returnData.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t">
                            <span className="text-muted-foreground block mb-1">Reason:</span>
                            <p className="text-sm">{returnData.reason}</p>
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Financial Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total Refund:</span>
                            <span>${returnData.totalRefund.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Return</DialogTitle>
                        <DialogDescription>
                            This will approve the return and restore inventory. Please provide your user ID.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="approveUserId">User ID</Label>
                            <Input
                                id="approveUserId"
                                placeholder="Enter your user ID"
                                value={userId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button onClick={handleApprove} disabled={isProcessing || !userId}>
                            {isProcessing ? "Approving..." : "Confirm Approval"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Return</DialogTitle>
                        <DialogDescription>
                            This will reject the return. Inventory will NOT be restored. Please provide a reason.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rejectUserId">User ID</Label>
                            <Input
                                id="rejectUserId"
                                placeholder="Enter your user ID"
                                value={userId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rejectionReason">Rejection Reason</Label>
                            <Textarea
                                id="rejectionReason"
                                placeholder="Enter reason for rejection"
                                value={rejectionReason}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject} disabled={isProcessing || !userId || !rejectionReason}>
                            {isProcessing ? "Rejecting..." : "Confirm Rejection"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ReturnDetail;
