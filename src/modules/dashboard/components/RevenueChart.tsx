import { 
    Bar, 
    BarChart, 
    CartesianGrid, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/elements/card";
import type { HourlyTrend } from "../models/Dashboard";

interface RevenueChartProps {
    data: HourlyTrend[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
    // Fill in missing hours
    const chartData = Array.from({ length: 24 }, (_, hour) => {
        const hourData = data.find(h => h.hour === hour);
        return {
            name: `${hour}:00`,
            ventas: hourData?.totalRevenue || 0,
            cantidad: hourData?.salesCount || 0
        };
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Tendencias de Ventas por Hora</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={formatCurrency}
                            />
                            <Tooltip 
                                formatter={(value: number) => [formatCurrency(value), "Ingresos"]}
                                labelStyle={{ color: 'black' }}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Bar 
                                dataKey="ventas" 
                                fill="currentColor" 
                                radius={[4, 4, 0, 0]} 
                                className="fill-primary" 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
