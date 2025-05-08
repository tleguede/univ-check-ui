import { User, UserCreateInput, UserUpdateInput } from "@/types/user.types";
import api from "@/utils/axios";

// Fonction utilitaire pour récupérer le token de manière plus sécurisée
function getAuthToken() {
  if (typeof window === "undefined") return null; // Vérification côté serveur

  try {
    const authData = localStorage.getItem("auth-user");
    if (!authData) return null;

    const parsedData = JSON.parse(authData);
    return parsedData?.token || null;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
    return null;
  }
}

export class UserService {
  static async getUsers(): Promise<User[]> {
    const token = getAuthToken();
    if (!token) throw new Error("Non authentifié");

    try {
      const { data } = await api.get(`/api/v1/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User> {
    const token = getAuthToken();
    if (!token) throw new Error("Non authentifié");

    try {
      const { data } = await api.get(`/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  static async createUser(input: UserCreateInput): Promise<User> {
    const token = getAuthToken();
    if (!token) throw new Error("Non authentifié");

    try {
      const { data } = await api.post(`/api/v1/users`, input, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      throw error;
    }
  }

  static async updateUser(user: UserUpdateInput): Promise<User> {
    const token = getAuthToken();
    if (!token) throw new Error("Non authentifié");

    try {
      const { id, ...updateData } = user;
      if (!id) throw new Error("ID d'utilisateur manquant pour la mise à jour");

      const { data } = await api.put(`/api/v1/users/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur:`, error);
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<void> {
    const token = getAuthToken();
    if (!token) throw new Error("Non authentifié");

    try {
      await api.delete(`/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      throw error;
    }
  }
}
