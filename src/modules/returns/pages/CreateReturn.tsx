import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import { Label } from "@/components/elements/label";
import { Textarea } from "@/components/elements/textarea";
import { PageHeader } from "@/components/widgets/PageHeader";
import { SearchableSelect } from "@/components/widgets/SearchableSelect";
import { useReturnApi } from "@/modules/returns/api/returnApi";
import { ReturnType } from "@/modules/returns/models/Return";
import { useSaleApi } from "@/modules/sales/api/saleApi";
import type { Sale, SaleDetail } from "@/modules/sales/models/Sale";
import { useUserApi } from "@/modules/users/userApi";
import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ReturnItemForm {
    productId: string;
    productName: string;
    maxQuantity: number;
    unitPrice: number;
    returnQuantity: number;
    condition: string;
    selected: boolean;
}

const CreateReturn = () => {
    const navigate = useNavigate();
    const { createReturn } = useReturnApi();
    const { getSaleById } = useSaleApi();
    const { searchUsers } = useUserApi();

    const [saleId, setSaleId] = useState("");
    const [sale, setSale] = useState<Sale | null>(null);
    const [userId, setUserId] = useState("");
    const [type, setType] = useState<ReturnType>(ReturnType.Refund);
    const [reason, setReason] = useState("");
    const [items, setItems] = useState<ReturnItemForm[]>([]);
    const [isLoadingSale, setIsLoadingSale] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSearchUsers = useCallback(async (term: string) => {
        try {
            const results = await searchUsers(term);
            return results.map(u => ({ label: `${u.name} ${u.firstLastname}`, value: u.id }));
        } catch (error) {
            console.error("Failed to search users", error);
            return [];
        }
    }, [searchUsers]);

    const handleLoadSale = async () => {
        if (!saleId.trim()) {
            toast.error("Please enter a sale ID");
            return;
        }

        setIsLoadingSale(true);
        try {
            const saleData = await getSaleById(saleId);
            
            if (saleData.isCancelled) {
                toast.error("Cannot create return for a cancelled sale");
                setSale(null);
                setItems([]);
                return;
            }

            // Check 30-day window
            const saleDate = new Date(saleData.createdAt);
            const daysSinceSale = Math.floor((Date.now() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceSale > 30) {
                toast.error(`Return window expired. Sale was ${daysSinceSale} days ago (max 30 days)`);
                setSale(null);
                setItems([]);
                return;
            }

            setSale(saleData);
            
            // Initialize items from sale details
            const returnItems: ReturnItemForm[] = saleData.details.map((detail: SaleDetail) => ({
                productId: detail.productId,
                productName: detail.productName,
                maxQuantity: detail.quantity,
                unitPrice: detail.unitPrice,
                returnQuantity: detail.quantity, // Default to full quantity
                condition: "Good",
                selected: false,
            }));
            setItems(returnItems);
            
            toast.success("Sale loaded successfully");
        } catch (error) {
            console.error("Failed to load sale", error);
            toast.error("Failed to load sale. Please check the ID and try again.");
            setSale(null);
            setItems([]);
        } finally {
            setIsLoadingSale(false);
        }
    };

    const handleToggleItem = (index: number) => {
        setItems(prev => prev.map((item, i) => 
            i === index ? { ...item, selected: !item.selected } : item
        ));
    };

    const handleQuantityChange = (index: number, value: string) => {
        const quantity = parseInt(value) || 0;
        setItems(prev => prev.map((item, i) => 
            i === index ? { ...item, returnQuantity: Math.min(quantity, item.maxQuantity) } : item
        ));
    };

    const handleConditionChange = (index: number, value: string) => {
        setItems(prev => prev.map((item, i) => 
            i === index ? { ...item, condition: value } : item
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!sale) {
            toast.error("Please load a sale first");
            return;
        }

        if (!userId || !reason) {
            toast.error("Please fill all required fields");
            return;
        }

        const selectedItems = items.filter(item => item.selected);
        if (selectedItems.length === 0) {
            toast.error("Please select at least one product to return");
            return;
        }

        // Validate quantities
        const invalidQuantity = selectedItems.find(item => item.returnQuantity <= 0 || item.returnQuantity > item.maxQuantity);
        if (invalidQuantity) {
            toast.error(`Invalid quantity for ${invalidQuantity.productName}`);
            return;
        }

        // Validate conditions
        const missingCondition = selectedItems.find(item => !item.condition.trim());
        if (missingCondition) {
            toast.error(`Please specify condition for ${missingCondition.productName}`);
            return;
        }

        setIsSubmitting(true);
        try {
            await createReturn({
                saleId: sale.id,
                customerId: sale.customerId,
                processedByUserId: userId,
                type,
                reason,
                items: selectedItems.map(item => ({
                    productId: item.productId,
                    quantity: item.returnQuantity,
                    unitPrice: item.unitPrice,
                    condition: item.condition,
                })),
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

    const selectedCount = items.filter(i => i.selected).length;
    const totalRefund = items
        .filter(i => i.selected)
        .reduce((sum, item) => sum + (item.unitPrice * item.returnQuantity), 0);

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

            <div className="max-w-4xl space-y-6">
                {/* Step 1: Load Sale */}
                <div className="border rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Step 1: Load Sale</h2>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Label htmlFor="saleId">Sale ID *</Label>
                            <Input
                                id="saleId"
                                value={saleId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaleId(e.target.value)}
                                placeholder="Enter sale ID"
                                disabled={!!sale}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button 
                                type="button" 
                                onClick={handleLoadSale} 
                                disabled={isLoadingSale || !!sale}
                            >
                                <Search className="w-4 h-4 mr-2" />
                                {isLoadingSale ? "Loading..." : "Load Sale"}
                            </Button>
                        </div>
                    </div>

                    {sale && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="font-semibold">Customer:</span> {sale.customerName}</div>
                                <div><span className="font-semibold">Seller:</span> {sale.userName}</div>
                                <div><span className="font-semibold">Date:</span> {new Date(sale.createdAt).toLocaleDateString()}</div>
                                <div><span className="font-semibold">Total:</span> ${sale.totalAmount.toFixed(2)}</div>
                            </div>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                    setSale(null);
                                    setItems([]);
                                    setSaleId("");
                                }}
                            >
                                Change Sale
                            </Button>
                        </div>
                    )}
                </div>

                {/* Step 2: Select Products */}
                {sale && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="border rounded-lg p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Step 2: Select Products to Return</h2>
                            
                            {items.length === 0 ? (
                                <p className="text-muted-foreground">No products in this sale</p>
                            ) : (
                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div 
                                            key={item.productId} 
                                            className={`border rounded-lg p-4 ${item.selected ? 'bg-accent/50' : ''}`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={item.selected}
                                                    onChange={() => handleToggleItem(index)}
                                                    className="mt-1 w-4 h-4"
                                                />
                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <div className="font-semibold">{item.productName}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Purchased: {item.maxQuantity} × ${item.unitPrice.toFixed(2)} = ${(item.maxQuantity * item.unitPrice).toFixed(2)}
                                                        </div>
                                                    </div>

                                                    {item.selected && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`quantity-${index}`}>
                                                                    Return Quantity (max: {item.maxQuantity})
                                                                </Label>
                                                                <Input
                                                                    id={`quantity-${index}`}
                                                                    type="number"
                                                                    min="1"
                                                                    max={item.maxQuantity}
                                                                    value={item.returnQuantity}
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                                        handleQuantityChange(index, e.target.value)
                                                                    }
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`condition-${index}`}>Condition</Label>
                                                                <select
                                                                    id={`condition-${index}`}
                                                                    value={item.condition}
                                                                    onChange={(e) => handleConditionChange(index, e.target.value)}
                                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                                    required
                                                                >
                                                                    <option value="Good">Good</option>
                                                                    <option value="Damaged">Damaged</option>
                                                                    <option value="Defective">Defective</option>
                                                                    <option value="Opened">Opened</option>
                                                                    <option value="Expired">Expired</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedCount > 0 && (
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Selected Items: {selectedCount}</span>
                                        <span className="text-lg font-bold">Total Refund: ${totalRefund.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Return Details */}
                        <div className="border rounded-lg p-6 space-y-4">
                            <h2 className="text-lg font-semibold">Step 3: Return Details</h2>

                            <div className="space-y-2">
                                <Label htmlFor="user">Processed By *</Label>
                                <SearchableSelect
                                    onSearch={handleSearchUsers}
                                    value={userId}
                                    onSelect={setUserId}
                                    placeholder="Select User"
                                    searchPlaceholder="Search user..."
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
                                    <option value={ReturnType.Refund}>Refund (Reembolso)</option>
                                    <option value={ReturnType.Exchange}>Exchange (Cambio)</option>
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
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isSubmitting || selectedCount === 0}
                        >
                            {isSubmitting ? "Creating..." : `Create Return (${selectedCount} items)`}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateReturn;
