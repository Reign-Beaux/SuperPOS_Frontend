import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
import type { 
    DashboardOverview, 
    PeriodSummary, 
    DashboardComparison, 
    TopProduct, 
    TopCustomer, 
    HourlyTrend,
    DashboardPeriod 
} from "../models/Dashboard";

const endpoints = {
    overview: "Dashboard/overview",
    summary: (period: DashboardPeriod, startDate?: string, endDate?: string) => 
        `Dashboard/summary?period=${period}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`,
    comparison: (period: DashboardPeriod) => `Dashboard/comparison?period=${period}`,
    topProducts: (period: DashboardPeriod, top: number = 10, startDate?: string, endDate?: string) => 
        `Dashboard/top-products?period=${period}&top=${top}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`,
    topCustomers: (period: DashboardPeriod, top: number = 10, startDate?: string, endDate?: string) => 
        `Dashboard/top-customers?period=${period}&top=${top}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`,
    hourlyTrends: (period: DashboardPeriod, startDate?: string, endDate?: string) => 
        `Dashboard/hourly-trends?period=${period}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`,
};

export const useDashboardApi = () => {
    const { get } = useHttpClient();

    const getOverview = useCallback(async () => {
        return await get<DashboardOverview>(endpoints.overview);
    }, [get]);

    const getSummary = useCallback(async (period: DashboardPeriod, startDate?: string, endDate?: string) => {
        return await get<PeriodSummary>(endpoints.summary(period, startDate, endDate));
    }, [get]);

    const getComparison = useCallback(async (period: DashboardPeriod) => {
        const response = await get<any>(endpoints.comparison(period));
        
        // Map backend names to frontend names if they differ
        return {
            ...response,
            salesChangePercent: response.salesChangePercent ?? response.salesCountChangePercent ?? 0,
            averageTicketChangePercent: response.averageTicketChangePercent ?? response.avgTicketChangePercent ?? 0,
            itemsSoldChangePercent: response.itemsSoldChangePercent ?? 0,
            customersChangePercent: response.customersChangePercent ?? 0
        } as DashboardComparison;
    }, [get]);

    const getTopProducts = useCallback(async (period: DashboardPeriod, top: number = 10, startDate?: string, endDate?: string) => {
        return await get<TopProduct[]>(endpoints.topProducts(period, top, startDate, endDate));
    }, [get]);

    const getTopCustomers = useCallback(async (period: DashboardPeriod, top: number = 10, startDate?: string, endDate?: string) => {
        return await get<TopCustomer[]>(endpoints.topCustomers(period, top, startDate, endDate));
    }, [get]);

    const getHourlyTrends = useCallback(async (period: DashboardPeriod, startDate?: string, endDate?: string) => {
        return await get<HourlyTrend[]>(endpoints.hourlyTrends(period, startDate, endDate));
    }, [get]);

    return {
        getOverview,
        getSummary,
        getComparison,
        getTopProducts,
        getTopCustomers,
        getHourlyTrends,
    };
};
