export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type UserWithoutPassword = Omit<User, "password">;

export type UserPublic = Pick<
  User,
  "id" | "name" | "email" | "role" | "created_at" | "updated_at"
>;
