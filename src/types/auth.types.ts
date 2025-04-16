export interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BetterAuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  userAgent?: string;
  ip?: string;
}

export interface BetterAuthSessionResponse {
  user?: BetterAuthUser;
  session?: BetterAuthSession;
  [key: string]: unknown;
}

export type UserRole = "USER" | "ADMIN" | "TEACHER" | "SUPERVISOR" | "DELEGATE";

export interface UserRoleAttributes {
  id: string;
  email: string;
  metadata?: {
    role?: string;
    permissions?: string[];
    department?: string;
  };
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: UserRole;
    createdAt: string;
    updatedAt?: string;
  };
  token: string;
}
