import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
import { authService } from "@/modules/Auth/services/AuthService";
import type { 
    SalesReportRequest, 
    InventoryReportRequest, 
    PerformanceReportRequest,
    ReportFormat 
} from "../models/Report";

const endpoints = {
    sales: "Report/sales",
    inventory: "Report/inventory",
    performance: "Report/performance",
};

export const useReportApi = () => {
    const { post } = useHttpClient();
    const apiUrl = import.meta.env.VITE_API_URL;

    const downloadFile = async (endpoint: string, data: any, fileName: string, format: ReportFormat) => {
        const token = authService.getAccessToken();
        const response = await fetch(`${apiUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to generate report');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.${format === 1 ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const generateSalesReport = useCallback(async (request: SalesReportRequest) => {
        await downloadFile(endpoints.sales, request, `Reporte-Ventas-${new Date().toISOString().split('T')[0]}`, request.filters.format);
    }, []);

    const generateInventoryReport = useCallback(async (request: InventoryReportRequest) => {
        await downloadFile(endpoints.inventory, request, `Reporte-Inventario-${new Date().toISOString().split('T')[0]}`, request.filters.format);
    }, []);

    const generatePerformanceReport = useCallback(async (request: PerformanceReportRequest) => {
        await downloadFile(endpoints.performance, request, `Reporte-Rendimiento-${new Date().toISOString().split('T')[0]}`, request.filters.format);
    }, []);

    return {
        generateSalesReport,
        generateInventoryReport,
        generatePerformanceReport,
    };
};
