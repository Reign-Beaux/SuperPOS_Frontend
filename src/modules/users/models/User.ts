export interface User {
  id: string;
  name: string;
  firstLastname: string;
  secondLastname?: string;
  email: string;
  phone?: string;
  roleId: string;
  roleName?: string;
}

export type CreateUserRequest = Omit<User, "id"> & { password: string };
export type UpdateUserRequest = User & { password?: string };

