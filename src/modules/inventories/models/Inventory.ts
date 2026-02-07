export interface Inventory {
    id: string;
    productId: string;
    productName: string;
    productDescription?: string;
    barcode?: string;
    stock: number;
    createdAt: string;
    updatedAt: string;
}

export interface InventoryAdjustRequest {
    productId: string;
    stock: number;
    operation: 0 | 1 | 2; // 0 = Add, 1 = Set, 2 = Remove
}
