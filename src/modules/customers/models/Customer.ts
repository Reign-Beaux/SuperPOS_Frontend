export interface Customer {
    id: string;
    name: string;
    firstLastname: string;
    secondLastname?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
}

export interface CreateCustomerRequest {
    name: string;
    firstLastname: string;
    secondLastname?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
}

export interface UpdateCustomerRequest {
    id: string;
    name: string;
    firstLastname: string;
    secondLastname?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
}
