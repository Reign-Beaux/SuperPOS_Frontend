import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import { SearchableSelect } from "@/components/widgets/SearchableSelect";
import { useCustomerApi } from "@/modules/customers/api/customerApi";
import type { Customer } from "@/modules/customers/models/Customer";
import { useInventoryApi } from "@/modules/inventories/api/inventoryApi";
import type { Product } from "@/modules/products/models/Product";
import { useProductApi } from "@/modules/products/productApi";
import { useSaleApi } from "@/modules/sales/api/saleApi";
import type { User } from "@/modules/users/models/User";
import { useUserApi } from "@/modules/users/userApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
    product: Product;
    quantity: number;
    stock: number;
}

const POS = () => {
    const navigate = useNavigate();
    const { getAllProducts } = useProductApi();
    const { getAllCustomers } = useCustomerApi();
    const { getAllUsers } = useUserApi();
    const { createSale } = useSaleApi();
    const { getInventoryByProduct } = useInventoryApi();

    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [productsData, customersData, usersData] = await Promise.all([
                    getAllProducts(),
                    getAllCustomers(),
                    getAllUsers(),
                ]);
                setProducts(productsData);
                setCustomers(customersData);
                setUsers(usersData);
            } catch (error) {
                console.error("Failed to load POS data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const addToCart = async (product: Product) => {
        // Check inventory first
        try {
            const inventory = await getInventoryByProduct(product.id);
            const stock = inventory.quantity;

            setCart(prev => {
                const existing = prev.find(item => item.product.id === product.id);
                if (existing) {
                    if (existing.quantity + 1 > stock) {
                        alert(`Not enough stock for ${product.name}. Available: ${stock}`);
                        return prev;
                    }
                    return prev.map(item =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                if (stock < 1) {
                    alert(`Not enough stock for ${product.name}. Available: ${stock}`);
                    return prev;
                }
                return [...prev, { product, quantity: 1, stock }];
            });
        } catch (error) {
            console.error("Failed to check inventory", error);
            alert("Could not check inventory. Please try again.");
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
                    alert(`Not enough stock. Available: ${item.stock}`);
                    return item;
                }
                return { ...item, quantity };
            }
            return item;
        }));
    };

    const handleCheckout = async () => {
        if (!selectedCustomerId || !selectedUserId || cart.length === 0) {
            alert("Please select customer, user and add items to cart.");
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
            alert("Sale created successfully!");
            navigate("/sales");
        } catch (error: any) {
            // Handle 409 Conflict (Stock) specially if possible, but global handler might catch it or axios
            console.error("Failed to create sale", error);
            alert("Failed to create sale. See console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchTerm))
    );

    const total = cart.reduce((sum, item) => sum + (100 * item.quantity), 0);

    if (isLoading) {
        return <div className="container mx-auto py-10">Loading POS data...</div>;
    }

    return (
        <div className="container mx-auto py-5 h-[calc(100vh-80px)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">POS (Point of Sale)</h1>
                <Button variant="secondary" onClick={() => navigate("/sales")}>History</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Left: Products */}
                <div className="md:col-span-2 flex flex-col gap-4 border rounded-md p-4 bg-background">
                    <Input
                        placeholder="Search products by name or barcode..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProducts.map(product => (
                            <div key={product.id}
                                className="border p-4 rounded-lg flex flex-col justify-between hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => addToCart(product)}
                            >
                                <div>
                                    <h3 className="font-bold">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground">{product.barcode}</p>
                                </div>
                                <Button size="sm" className="mt-2 w-full">Add to Cart</Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 border rounded-md p-4 bg-background">

                    <div className="space-y-2">
                        <label className="text-sm font-medium">User (Seller)</label>
                        <SearchableSelect
                            options={users.map(u => ({ label: `${u.name} ${u.firstLastname}`, value: u.id }))}
                            value={selectedUserId}
                            onSelect={setSelectedUserId}
                            placeholder="Select User"
                            searchPlaceholder="Search user..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Customer</label>
                        <SearchableSelect
                            options={customers.map(c => ({ label: `${c.name} ${c.firstLastname}`, value: c.id }))}
                            value={selectedCustomerId}
                            onSelect={setSelectedCustomerId}
                            placeholder="Select Customer"
                            searchPlaceholder="Search customer..."
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto border-t border-b py-2 space-y-2">
                        {cart.length === 0 && <p className="text-center text-muted-foreground py-4">Cart is empty</p>}
                        {cart.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center p-2 border rounded-md">
                                <div className="flex-1">
                                    <p className="font-medium truncate">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="outline" className="h-6 w-6"
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button size="icon" variant="outline" className="h-6 w-6"
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</Button>
                                    <Button size="icon" variant="destructive" className="h-6 w-6 ml-1"
                                        onClick={() => removeFromCart(item.product.id)}>x</Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-2">
                        <div className="flex justify-between text-lg font-bold mb-4">
                            <span>Total (Est.)</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isSubmitting}>
                            {isSubmitting ? "Processing..." : "Complete Sale"}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            *Price calculated by server
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default POS;
