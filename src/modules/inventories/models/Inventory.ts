export interface Inventory {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface InventoryAdjustRequest {
    productId: string;
    quantity: number;
    operation: 'Add' | 'Set';
}
