import { Routes } from "@/config/router/Routes";
import { useAuthStore } from "@/modules/Auth/hooks/useAuthStore";
import { Navigate } from "react-router-dom";
import { useDashboardOverview, useDashboardComparison } from "@/modules/dashboard/hooks/useDashboard";
import { SummaryCards } from "@/modules/dashboard/components/SummaryCards";
import { RevenueChart } from "@/modules/dashboard/components/RevenueChart";
import { TopProductsTable } from "@/modules/dashboard/components/TopProductsTable";
import { ComparisonMetrics } from "@/modules/dashboard/components/ComparisonMetrics";
import { DashboardPeriod } from "@/modules/dashboard/models/Dashboard";
import { PageHeader } from "@/components/widgets/PageHeader";
import { Skeleton } from "@/components/elements/skeleton";
import { LayoutDashboard } from "lucide-react";

export const Dashboard = () => {
    const { user } = useAuthStore();
    const { data: overview, isLoading: isLoadingOverview, error: errorOverview } = useDashboardOverview();
    const { data: comparison, isLoading: isLoadingComparison } = useDashboardComparison(DashboardPeriod.ThisMonth);
    
    const isLoading = isLoadingOverview || isLoadingComparison;
    const error = errorOverview;
    
    if (user?.role?.name === 'Vendedor') {
        return <Navigate to={Routes.POS} replace />;
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-destructive">Error al cargar el dashboard</h2>
                <p className="text-muted-foreground mt-2">Por favor, intenta de nuevo más tarde.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <PageHeader 
                title="Panel de Control" 
                subtitle={`Hola, ${user?.name}. Aquí tienes un resumen del negocio.`}
                icon={LayoutDashboard}
            />

            {isLoading ? (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl" />
                        ))}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Skeleton className="h-[400px] md:col-span-4 rounded-xl" />
                        <Skeleton className="h-[400px] md:col-span-3 rounded-xl" />
                    </div>
                </div>
            ) : overview && (
                <>
                    <SummaryCards summary={overview.todaySummary} />
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <RevenueChart data={overview.hourlyTrends} />
                        <div className="md:col-span-3 flex flex-col gap-4">
                            {comparison && <ComparisonMetrics comparison={comparison} />}
                            <TopProductsTable products={overview.topProducts} />
                        </div>
                    </div>
                    
                    {/* Additional summary metrics for this week/month can be added here if needed */}
                </>
            )}
        </div>
    );
};
