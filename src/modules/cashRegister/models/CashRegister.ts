import type { Sale } from "@/modules/sales/models/Sale";

export interface CashRegister {
    id: string;
    userId: string;
    userName: string;
    openingDate: string;
    closingDate: string;
    initialCash: number;
    finalCash: number;
    totalSales: number;
    totalTransactions: number;
    totalItemsSold: number;
    difference: number;
    notes?: string;
    createdAt: string;
}

export interface CreateCashRegisterRequest {
    userId: string;
    openingDate: string;
    closingDate: string;
    initialCash: number;
    finalCash: number;
    notes?: string;
}

export interface CashRegisterResponse {
    cashRegister: CashRegister;
    sales: Sale[];
}
