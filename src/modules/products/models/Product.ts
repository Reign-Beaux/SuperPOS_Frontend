export interface Product {
    id: string;
    name: string;
    description: string;
    barcode: string;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    barcode: string;
}

export interface UpdateProductRequest {
    id: string;
    name: string;
    description: string;
    barcode: string;
}
