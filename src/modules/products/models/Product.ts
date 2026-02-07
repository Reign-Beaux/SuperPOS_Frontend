export interface Product {
    id: string;
    name: string;
    description: string;
    barcode: string;
    unitPrice: number;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    barcode: string;
    unitPrice: number;
}

export interface UpdateProductRequest {
    id: string;
    name: string;
    description: string;
    barcode: string;
    unitPrice: number;
}
