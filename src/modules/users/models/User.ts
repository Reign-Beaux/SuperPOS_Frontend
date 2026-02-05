export interface UserRole {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  firstLastname: string;
  secondLastname?: string;
  email: string;
  phone?: string;
  role?: UserRole;
}

export interface CreateUserRequest {
  name: string;
  firstLastname: string;
  secondLastname?: string;
  email: string;
  phone?: string;
  roleId: string;
  password: string;
}

export interface UpdateUserRequest {
  id: string;
  name: string;
  firstLastname: string;
  secondLastname?: string;
  email: string;
  phone?: string;
  roleId: string;
  password?: string;
}

