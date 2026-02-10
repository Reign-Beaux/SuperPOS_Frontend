export interface SaleDetail {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Sale {
    id: string;
    customerId: string;
    customerName: string;
    userId: string;
    userName: string;
    totalAmount: number;
    createdAt: string;
    details: SaleDetail[];
    isCancelled?: boolean;
    cancelledAt?: string;
    cancelledByUserId?: string;
    cancellationReason?: string;
}

export interface SaleItemRequest {
    productId: string;
    quantity: number;
}

export interface CreateSaleRequest {
    customerId: string;
    userId: string;
    items: SaleItemRequest[];
}
