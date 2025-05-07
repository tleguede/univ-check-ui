import { UserRole } from "./auth.types";

export interface UserData {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  metadata?: {
    permissions?: string[];
  };
}

export interface User {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  metadata?: {
    permissions?: string[];
  };
}
