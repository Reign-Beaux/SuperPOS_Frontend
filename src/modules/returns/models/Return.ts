export const ReturnType = {
    Refund: 1,
    Exchange: 2
} as const;

export type ReturnType = typeof ReturnType[keyof typeof ReturnType];

export const ReturnStatus = {
    Pending: 1,
    Approved: 2,
    Rejected: 3
} as const;

export type ReturnStatus = typeof ReturnStatus[keyof typeof ReturnStatus];

export interface ReturnItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    condition: string;
}

export interface Return {
    id: string;
    saleId: string;
    customerId: string;
    processedByUserId: string;
    type: ReturnType;
    status: ReturnStatus;
    reason: string;
    totalRefund: number;
    createdAt: string;
    approvedAt?: string;
    approvedByUserId?: string;
    rejectedAt?: string;
    rejectedByUserId?: string;
    rejectionReason?: string;
    items: ReturnItem[];
}

export interface CreateReturnRequest {
    saleId: string;
    customerId: string;
    processedByUserId: string;
    type: ReturnType;
    reason: string;
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
        condition: string;
    }[];
}
