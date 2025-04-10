import { AUTH_CONSTANTS } from "@/config/constants";
import { SignInInput } from "@/schema/sign-in.schema";
import api from "@/utils/axios";

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: "admin" | "professor";
    name: string;
  };
  token: string;
}

export class AuthenticationError extends Error {
  constructor(message: string = "Identifiants incorrects") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthService {
  static async signIn(credentials: SignInInput): Promise<AuthResponse> {
    try{
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // login 
      const {data} = await api.post("/api/v1/auth/signin", {credentials});
      return data;
    }catch (error) {
      console.error("Login failed:", error);
      throw new AuthenticationError("Invalid credentials or server error."); 
    }


    const { ADMIN, PROFESSOR } = AUTH_CONSTANTS.DEMO_CREDENTIALS;

    if (credentials.email === ADMIN.email && credentials.password === ADMIN.password) {
      return {
        user: {
          id: "admin-1",
          email: ADMIN.email,
          role: "admin",
          name: "Administrateur",
        },
        token: "simulated-jwt-token-admin-12345",
      };
    }

    if (credentials.email === PROFESSOR.email && credentials.password === PROFESSOR.password) {
      return {
        user: {
          id: "prof-1",
          email: PROFESSOR.email,
          role: "professor",
          name: "Professeur Dupont",
        },
        token: "simulated-jwt-token-professor-12345",
      };
    }

    throw new AuthenticationError();
  }

  static async signOut(): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  }

  static async getCurrentUser(token: string): Promise<AuthResponse["user"] | null> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!token) return null;

    if (token.includes("admin")) {
      return {
        id: "admin-1",
        email: AUTH_CONSTANTS.DEMO_CREDENTIALS.ADMIN.email,
        role: "admin",
        name: "Administrateur",
      };
    } else if (token.includes("professor")) {
      return {
        id: "prof-1",
        email: AUTH_CONSTANTS.DEMO_CREDENTIALS.PROFESSOR.email,
        role: "professor",
        name: "Professeur Dupont",
      };
    }

    return null;
  }
}
