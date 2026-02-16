import { DashboardPeriod } from "@/modules/dashboard/models/Dashboard";

export enum ReportFormat {
    PDF = 1,
    Excel = 2
}

export interface ReportFilters {
    period: DashboardPeriod;
    customStartDate?: string | null;
    customEndDate?: string | null;
    customerId?: string | null;
    productId?: string | null;
    daysOfWeek?: number[] | null;
    specificMonth?: number | null;
    specificYear?: number | null;
    topItemsLimit?: number;
    format: ReportFormat;
}

export interface SalesReportRequest {
    filters: ReportFilters;
    includeDetailedSales?: boolean;
}

export interface InventoryReportRequest {
    filters: {
        format: ReportFormat;
    };
}

export interface PerformanceReportRequest {
    filters: {
        period: DashboardPeriod;
        customStartDate?: string | null;
        customEndDate?: string | null;
        topItemsLimit?: number;
        format: ReportFormat;
    };
}
