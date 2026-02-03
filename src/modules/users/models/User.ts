export interface User {
  id: string;
  name: string;
  firstLastname: string;
  secondLastname?: string;
  email: string;
  phone?: string;
}

export type CreateUserRequest = Omit<User, "id">;
export type UpdateUserRequest = User;
