import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import { Label } from "@/components/elements/label";
import { Textarea } from "@/components/elements/textarea";
import { PageHeader } from "@/components/widgets/PageHeader";
import { useReturnApi } from "@/modules/returns/api/returnApi";
import { ReturnType } from "@/modules/returns/models/Return";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateReturn = () => {
    const navigate = useNavigate();
    const { createReturn } = useReturnApi();

    const [saleId, setSaleId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [userId, setUserId] = useState("");
    const [type, setType] = useState<ReturnType>(ReturnType.Refund);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!saleId || !customerId || !userId || !reason) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await createReturn({
                saleId,
                customerId,
                processedByUserId: userId,
                type,
                reason,
                items: [], // Simplified - in real app would select items from sale
            });
            toast.success("Return created successfully");
            navigate("/returns");
        } catch (error) {
            console.error("Failed to create return", error);
            toast.error("Failed to create return");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Create Return"
                action={
                    <Button variant="outline" onClick={() => navigate("/returns")}>
                        Cancel
                    </Button>
                }
            />

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 border rounded-lg p-6">
                <div className="space-y-2">
                    <Label htmlFor="saleId">Sale ID *</Label>
                    <Input
                        id="saleId"
                        value={saleId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaleId(e.target.value)}
                        placeholder="Enter sale ID"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="customerId">Customer ID *</Label>
                    <Input
                        id="customerId"
                        value={customerId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerId(e.target.value)}
                        placeholder="Enter customer ID"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="userId">Processed By User ID *</Label>
                    <Input
                        id="userId"
                        value={userId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
                        placeholder="Enter user ID"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Return Type *</Label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(Number(e.target.value) as ReturnType)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                    >
                        <option value={ReturnType.Refund}>Refund</option>
                        <option value={ReturnType.Exchange}>Exchange</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="reason">Reason *</Label>
                    <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                        placeholder="Enter reason for return"
                        rows={3}
                        required
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Return"}
                </Button>
            </form>
        </div>
    );
};

export default CreateReturn;
