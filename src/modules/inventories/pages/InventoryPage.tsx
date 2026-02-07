import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/elements/dialog";
import { Label } from "@/components/elements/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/elements/tabs";
import { useInventoryApi } from "@/modules/inventories/api/inventoryApi";
import type { Inventory } from "@/modules/inventories/models/Inventory";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const InventoryPage = () => {
    const { getAllInventories, adjustInventory } = useInventoryApi();
    const queryClient = useQueryClient();

    const [isAdjustOpen, setIsAdjustOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
    const [adjustQuantity, setAdjustQuantity] = useState<string>("");
    const [adjustType, setAdjustType] = useState<"in" | "out">("in");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: inventories, isLoading } = useQuery({
        queryKey: ["inventories"],
        queryFn: getAllInventories,
    });

    const filteredInventories = inventories?.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleOpenAdjust = (inventory: Inventory) => {
        setSelectedInventory(inventory);
        setAdjustQuantity("");
        setAdjustType("in");
        setIsAdjustOpen(true);
    };

    const handleAdjustSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInventory) return;

        const qty = parseInt(adjustQuantity);
        if (isNaN(qty) || qty <= 0) {
            toast.error("Please enter a valid positive quantity");
            return;
        }

        setIsSubmitting(true);
        try {
            // Operation 0 = Add (Entrada)
            // Operation 2 = Remove (Salida)
            // Stock must always be positive.
            const operation = adjustType === "in" ? 0 : 2;

            await adjustInventory({
                productId: selectedInventory.productId,
                stock: qty,
                operation: operation,
            });

            toast.success(`Stock ${adjustType === "in" ? "added" : "removed"} successfully`);
            setIsAdjustOpen(false);
            queryClient.invalidateQueries({ queryKey: ["inventories"] });
        } catch (error) {
            console.error("Failed to adjust inventory", error);
            toast.error("Failed to update stock");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-8">Loading inventory...</div>;

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            </div>

            <div className="flex items-center gap-4">
                <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-md">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Barcode</th>
                            <th className="p-4 text-center">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredInventories.map((item) => (
                            <tr key={item.productId} className="hover:bg-muted/50">
                                <td className="p-4">
                                    <div className="font-medium">{item.productName}</div>
                                    <div className="text-xs text-muted-foreground">{item.productDescription}</div>
                                </td>
                                <td className="p-4 font-mono text-sm">{item.barcode || '-'}</td>
                                <td className="p-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {item.stock}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <Button variant="outline" size="sm" onClick={() => handleOpenAdjust(item)}>
                                        Adjust
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filteredInventories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-muted-foreground">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adjust Stock: {selectedInventory?.productName}</DialogTitle>
                        <DialogDescription>
                            Select operation type and quantity.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAdjustSubmit} className="space-y-4 py-4">
                        <Tabs value={adjustType} onValueChange={(v) => setAdjustType(v as "in" | "out")}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="in">Input (Entrada)</TabsTrigger>
                                <TabsTrigger value="out">Output (Salida)</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={adjustQuantity}
                                onChange={(e) => setAdjustQuantity(e.target.value)}
                                placeholder="Enter quantity..."
                                autoFocus
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAdjustOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Adjustment"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InventoryPage;
