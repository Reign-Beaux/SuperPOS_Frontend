import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/elements/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/elements/card";
import type { TopProduct } from "../models/Dashboard";

interface TopProductsTableProps {
    products: TopProduct[];
}

export const TopProductsTable = ({ products }: TopProductsTableProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead className="text-right">Cantidad</TableHead>
                            <TableHead className="text-right">Ingresos</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.productId}>
                                <TableCell className="font-medium">{product.productName}</TableCell>
                                <TableCell className="text-right">{product.quantitySold}</TableCell>
                                <TableCell className="text-right">{formatCurrency(product.totalRevenue)}</TableCell>
                            </TableRow>
                        ))}
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                    No hay datos disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
