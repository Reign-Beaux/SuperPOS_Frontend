export interface Article {
    id: string;
    name: string;
    description: string;
    barcode: string;
}

export interface CreateArticleRequest {
    name: string;
    description: string;
    barcode: string;
}

export interface UpdateArticleRequest {
    id: string;
    name: string;
    description: string;
    barcode: string;
}
