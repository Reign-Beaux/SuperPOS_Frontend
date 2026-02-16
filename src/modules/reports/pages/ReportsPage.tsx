import { PageHeader } from "@/components/widgets/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/elements/card";
import { Button } from "@/components/elements/button";
import { FileText, Download, BarChart2, Package } from "lucide-react";
import { useReportApi } from "../api/reportApi";
import { DashboardPeriod } from "@/modules/dashboard/models/Dashboard";
import { ReportFormat } from "../models/Report";
import { useState } from "react";
import { toast } from "sonner";

export const ReportsPage = () => {
    const { generateSalesReport, generateInventoryReport, generatePerformanceReport } = useReportApi();
    const [loading, setLoading] = useState<string | null>(null);

    const handleDownload = async (type: 'sales' | 'inventory' | 'performance', format: ReportFormat) => {
        setLoading(`${type}-${format}`);
        try {
            if (type === 'sales') {
                await generateSalesReport({
                    filters: { period: DashboardPeriod.ThisMonth, format }
                });
            } else if (type === 'inventory') {
                await generateInventoryReport({
                    filters: { format }
                });
            } else if (type === 'performance') {
                await generatePerformanceReport({
                    filters: { period: DashboardPeriod.ThisMonth, format }
                });
            }
            toast.success("Reporte generado exitosamente");
        } catch (error) {
            toast.error("Error al generar el reporte");
        } finally {
            setLoading(null);
        }
    };

    const reportCards = [
        {
            id: 'sales',
            title: "Reporte de Ventas",
            description: "Resumen detallado de transacciones, ingresos y métricas del mes actual.",
            icon: FileText,
            color: "text-blue-600"
        },
        {
            id: 'inventory',
            title: "Reporte de Inventario",
            description: "Estado actual del stock, productos agotados y valor total del inventario.",
            icon: Package,
            color: "text-orange-600"
        },
        {
            id: 'performance',
            title: "Reporte de Rendimiento",
            description: "Análisis comparativo y KPIs clave del rendimiento del negocio.",
            icon: BarChart2,
            color: "text-green-600"
        }
    ];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <PageHeader 
                title="Reportes Avanzados" 
                subtitle="Genera y descarga reportes detallados en formato PDF o Excel."
                icon={Download}
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reportCards.map((report) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <report.icon className={`h-5 w-5 ${report.color}`} />
                                <CardTitle>{report.title}</CardTitle>
                            </div>
                            <CardDescription>{report.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => handleDownload(report.id as any, ReportFormat.PDF)}
                                disabled={!!loading}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                {loading === `${report.id}-1` ? "Generando..." : "Descargar PDF"}
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => handleDownload(report.id as any, ReportFormat.Excel)}
                                disabled={!!loading}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                {loading === `${report.id}-2` ? "Generando..." : "Descargar Excel"}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
