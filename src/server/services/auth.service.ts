import { AUTH_CONSTANTS } from "@/config/constants";
import { authClient } from "@/lib/client";
import { SignInInput } from "@/schema/sign-in.schema";
import { AuthResponse, UserRole } from "@/types/auth.types";
import { UserData } from "@/types/user.types";

export class AuthenticationError extends Error {
  constructor(message: string = "Identifiants incorrects") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthService {
  static async signIn(credentials: SignInInput): Promise<AuthResponse> {
    try {
      const { data, error } = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new AuthenticationError(error.message);
      }

      if (!data) {
        throw new AuthenticationError("Aucune donnée reçue du serveur");
      }

      // Check if user data is directly in the response or in a user property
      let userData: UserData;
      if ("user" in data && data.user && "email" in data.user) {
        // User data is nested in a user property
        userData = data.user as UserData;
      } else if ("email" in data) {
        // User data is at the top level
        userData = data as unknown as UserData;
      } else {
        console.error("Structure de données utilisateur invalide:", data);
        throw new AuthenticationError("Structure de données utilisateur invalide");
      }

      // Use the role directly from the response
      return {
        user: {
          id: userData.id || "unknown-id",
          email: userData.email,
          name: userData.name || "Utilisateur",
          phone: userData.phone || "Non spécifié",
          role: userData.role || "USER",
          createdAt: userData.createdAt
            ? typeof userData.createdAt === "string"
              ? userData.createdAt
              : userData.createdAt.toISOString()
            : new Date().toISOString(),
          updatedAt: userData.updatedAt
            ? typeof userData.updatedAt === "string"
              ? userData.updatedAt
              : userData.updatedAt.toISOString()
            : undefined,
        },
        token: data.token || "",
      };
    } catch (error) {
      console.error("Login failed:", error);
      throw new AuthenticationError("Identifiants invalides ou erreur du serveur.");
    }
  }

  static async signOut(): Promise<{ success: boolean }> {
    try {
      const { error } = await authClient.signOut({});

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      return { success: false };
    }
  }

  static async getCurrentUser(token: string): Promise<AuthResponse["user"] | null> {
    try {
      if (!token) {
        console.error("Aucun token d'authentification fourni");
        return null;
      }

      const { data, error } = await authClient.getSession({
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });

      if (error || !data) {
        console.error("Erreur lors de la récupération de la session:", error);
        return null;
      }

      // Si nous avons déjà les données de l'utilisateur dans la réponse, les utiliser
      if (data.user && data.user.email) {
        return data.user;
      }

      // Sinon, essayer de récupérer les données de l'utilisateur
      const userResponse = await authClient.getUser({
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });

      if (userResponse.error || !userResponse.data) {
        console.error("Erreur lors de la récupération des données de l'utilisateur:", userResponse.error);
        return null;
      }

      const userData = userResponse.data;

      if (!userData || !userData.email) {
        console.error("Structure de données utilisateur invalide dans getCurrentUser:", userData);
        return null;
      }

      const role = this.determineUserRole(userData.email, userData);

      return {
        id: userData.id || "unknown-id",
        email: userData.email,
        name: userData.name || "Utilisateur",
        phone: userData.phone || "Non spécifié",
        role,
        createdAt: userData.createdAt
          ? typeof userData.createdAt === "string"
            ? userData.createdAt
            : userData.createdAt.toISOString()
          : new Date().toISOString(),
        updatedAt: userData.updatedAt
          ? typeof userData.updatedAt === "string"
            ? userData.updatedAt
            : userData.updatedAt.toISOString()
          : undefined,
      };
    } catch (error) {
      console.error("Get current user failed:", error);
      return null;
    }
  }

  static async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await authClient.forgetPassword({
        email,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Forgot password failed:", error);
      return { success: false, error: "Une erreur s'est produite lors de la demande de réinitialisation du mot de passe." };
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await authClient.resetPassword({
        token,
        newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Reset password failed:", error);
      return { success: false, error: "Une erreur s'est produite lors de la réinitialisation du mot de passe." };
    }
  }

  private static determineUserRole(email: string, userData?: UserData): UserRole {
    if (userData?.role) {
      const roleFromUserdata = userData.role.toUpperCase();
      if (["ADMIN", "TEACHER", "SUPERVISOR", "DELEGATE", "USER"].includes(roleFromUserdata)) {
        return roleFromUserdata as UserRole;
      }
    }

    if (userData?.metadata?.permissions) {
      const permissions = userData.metadata.permissions;
      if (permissions.includes("admin:all")) return "ADMIN";
      if (permissions.includes("teacher:manage")) return "TEACHER";
      if (permissions.includes("supervisor:manage")) return "SUPERVISOR";
      if (permissions.includes("delegate:represent")) return "DELEGATE";
    }

    if (email === AUTH_CONSTANTS.DEMO_CREDENTIALS.ADMIN.email) {
      return "ADMIN";
    } else if (email.includes("professeur") || email.includes("teacher")) {
      return "TEACHER";
    } else if (email.includes("supervisor")) {
      return "SUPERVISOR";
    } else if (email.includes("delegate")) {
      return "DELEGATE";
    } else {
      return "USER";
    }
  }
}
