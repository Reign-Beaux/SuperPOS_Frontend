import { Button } from "@/components/elements/button";
import { SearchableSelect } from "@/components/widgets/SearchableSelect";
import { useCustomerApi } from "@/modules/customers/api/customerApi";

import { useInventoryApi } from "@/modules/inventories/api/inventoryApi";
import type { Product } from "@/modules/products/models/Product";
import { useProductApi } from "@/modules/products/productApi";
import { useSaleApi } from "@/modules/sales/api/saleApi";

import { useUserApi } from "@/modules/users/userApi";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface CartItem {
    product: Product;
    quantity: number;
    stock: number;
}

const POS = () => {
    const { searchProducts } = useProductApi();
    const { searchCustomers } = useCustomerApi();
    const { searchUsers } = useUserApi();
    const { createSale } = useSaleApi();
    const { getInventoryByProduct } = useInventoryApi();

    // Temporary storage for search results to enable selection
    const searchResultsRef = useRef<Product[]>([]);

    const [cart, setCart] = useState<CartItem[]>([]);

    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSearchCustomers = useCallback(async (term: string) => {
        try {
            const results = await searchCustomers(term);
            return results.map(c => ({ label: `${c.name} ${c.firstLastname}`, value: c.id }));
        } catch (error) {
            console.error("Failed to search customers", error);
            return [];
        }
    }, [searchCustomers]);

    const handleSearchUsers = useCallback(async (term: string) => {
        try {
            const results = await searchUsers(term);
            return results.map(u => ({ label: `${u.name} ${u.firstLastname}`, value: u.id }));
        } catch (error) {
            console.error("Failed to search users", error);
            return [];
        }
    }, [searchUsers]);

    const addToCart = async (product: Product) => {
        // Check inventory first
        try {
            const inventory = await getInventoryByProduct(product.id);
            const stock = inventory.stock;

            setCart(prev => {
                const existing = prev.find(item => item.product.id === product.id);
                if (existing) {
                    if (existing.quantity + 1 > stock) {
                        toast.error(`Not enough stock for ${product.name}. Available: ${stock}`);
                        return prev;
                    }
                    return prev.map(item =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                if (stock < 1) {
                    toast.error(`Not enough stock for ${product.name}. Available: ${stock}`);
                    return prev;
                }
                return [...prev, { product, quantity: 1, stock }];
            });
        } catch (error) {
            console.error("Failed to check inventory", error);
            toast.error("Could not check inventory. Please try again.");
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                if (quantity > item.stock) {
                    toast.error(`Not enough stock. Available: ${item.stock}`);
                    return item;
                }
                return { ...item, quantity };
            }
            return item;
        }));
    };

    const handleCheckout = async () => {
        if (!selectedCustomerId || !selectedUserId || cart.length === 0) {
            toast.warning("Please select customer, user and add items to cart.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createSale({
                customerId: selectedCustomerId,
                userId: selectedUserId,
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                }))
            });
            toast.success("Sale created successfully!");

            // Clear cart and customer, but keep user selected
            setCart([]);
            setSelectedCustomerId("");
        } catch (error: any) {
            console.error("Failed to create sale", error);
            toast.error("Failed to create sale. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Client-side filtering removed in favor of server-side search

    const total = cart.reduce((sum, item) => sum + (item.product.unitPrice * item.quantity), 0);

    return (
        <div className="container mx-auto py-5 h-[calc(100vh-80px)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">POS (Point of Sale)</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Left: Cart Items List */}
                <div className="md:col-span-2 flex flex-col gap-4 border rounded-md p-4 bg-background">
                    <SearchableSelect
                        onSearch={async (term) => {
                            if (term.length < 3) return [];
                            try {
                                const results = await searchProducts(term);
                                // Store results in ref for later selection
                                searchResultsRef.current = results;
                                return results.map((p: Product) => ({
                                    label: p.name,
                                    value: p.id
                                }));
                            } catch (error) {
                                console.error("Search failed", error);
                                searchResultsRef.current = [];
                                return [];
                            }
                        }}
                        onSelect={(productId) => {
                            // Find product from the stored search results
                            const product = searchResultsRef.current.find(p => p.id === productId);
                            if (product) {
                                addToCart(product);
                            }
                        }}
                        placeholder="Search products by name or barcode..."
                        searchPlaceholder="Type to search..."
                        value=""
                    />

                    {/* Cart Items as Rows */}
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {cart.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                Search or scan a product to add it to the cart
                            </p>
                        )}
                        {cart.map(item => (
                            <div key={item.product.id} className="flex items-center gap-4 p-3 border rounded-md bg-card">
                                <div className="flex-1">
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {item.product.barcode} • Stock: {item.stock}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    >
                                        -
                                    </Button>
                                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    >
                                        +
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="h-8 w-8 ml-2"
                                        onClick={() => removeFromCart(item.product.id)}
                                    >
                                        ×
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 border rounded-md p-4 bg-background">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">User (Seller)</label>
                        <SearchableSelect
                            onSearch={handleSearchUsers}
                            value={selectedUserId}
                            onSelect={setSelectedUserId}
                            placeholder="Select User"
                            searchPlaceholder="Search user..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Customer</label>
                        <SearchableSelect
                            onSearch={handleSearchCustomers}
                            value={selectedCustomerId}
                            onSelect={setSelectedCustomerId}
                            placeholder="Select Customer"
                            searchPlaceholder="Search customer..."
                        />
                    </div>

                    <div className="flex-1"></div>

                    {/* Financial Summary */}
                    <div className="space-y-3 border-t pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="font-medium">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">IVA (16%):</span>
                            <span className="font-medium">${(total * 0.16).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t pt-3">
                            <span>Total:</span>
                            <span>${(total * 1.16).toFixed(2)}</span>
                        </div>
                    </div>

                    <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Complete Sale"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        *Price calculated by server
                    </p>
                </div>
            </div>
        </div >
    );
};

export default POS;
