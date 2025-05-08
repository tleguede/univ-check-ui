import { UserRole } from "./auth.types";

export interface User {
  id?: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  metadata?: {
    permissions?: string[];
  };
}

// Utilisé pour les entrées de formulaire
export type UserFormData = Omit<User, "id" | "createdAt" | "updatedAt">;

// Type pour la création d'utilisateur (sans id, dates)
export type UserCreateInput = Omit<User, "id" | "createdAt" | "updatedAt"> & { password: string };

// Type pour la mise à jour d'utilisateur (avec id obligatoire)
export type UserUpdateInput = Partial<Omit<User, "id">> & { id: string };
