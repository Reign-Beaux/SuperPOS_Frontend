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

export const InventoryOperation = {
    Add: 0,
    Set: 1,
    Remove: 2
} as const;

export type InventoryOperation = typeof InventoryOperation[keyof typeof InventoryOperation];

export interface InventoryAdjustRequest {
    productId: string;
    stock: number;
    operation: InventoryOperation;
}
