import { useQuery } from "@tanstack/react-query";
import { useDashboardApi } from "../api/dashboardApi";
import { DashboardPeriod } from "../models/Dashboard";

export const useDashboardOverview = () => {
    const { getOverview } = useDashboardApi();
    return useQuery({
        queryKey: ['dashboard', 'overview'],
        queryFn: getOverview,
    });
};

export const useDashboardComparison = (period: DashboardPeriod) => {
    const { getComparison } = useDashboardApi();
    return useQuery({
        queryKey: ['dashboard', 'comparison', period],
        queryFn: () => getComparison(period),
        enabled: [DashboardPeriod.Today, DashboardPeriod.ThisWeek, DashboardPeriod.ThisMonth].includes(period),
    });
};
