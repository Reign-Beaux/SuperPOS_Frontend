export interface Role {
    id: string;
    name: string;
    description?: string;
}

export interface CreateRoleRequest {
    name: string;
    description?: string;
}

export interface UpdateRoleRequest {
    id: string;
    name: string;
    description?: string;
}
