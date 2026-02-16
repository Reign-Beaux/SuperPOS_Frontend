export interface PeriodSummary {
    startDate: string;
    endDate: string;
    totalSales: number;
    totalRevenue: number;
    averageTicketSize: number;
    totalItemsSold: number;
    totalCustomers: number;
    highestSale: number;
    lowestSale: number;
}

export interface TopProduct {
    productId: string;
    productName: string;
    quantitySold: number;
    totalRevenue: number;
    transactionCount: number;
}

export interface TopCustomer {
    customerId: string;
    customerName: string;
    purchaseCount: number;
    totalSpent: number;
    averageTicketSize: number;
}

export interface HourlyTrend {
    hour: number;
    salesCount: number;
    totalRevenue: number;
}

export interface DashboardOverview {
    todaySummary: PeriodSummary;
    thisWeekSummary: PeriodSummary;
    thisMonthSummary: PeriodSummary;
    topProducts: TopProduct[];
    topCustomers: TopCustomer[];
    hourlyTrends: HourlyTrend[];
}

export interface DashboardComparison {
    currentPeriod: PeriodSummary;
    previousPeriod: PeriodSummary;
    revenueChangePercent: number;
    salesChangePercent: number;
    averageTicketChangePercent: number;
    itemsSoldChangePercent: number;
    customersChangePercent: number;
}

export enum DashboardPeriod {
    Today = 1,
    Yesterday = 2,
    ThisWeek = 3,
    LastWeek = 4,
    ThisMonth = 5,
    LastMonth = 6,
    Custom = 99
}
