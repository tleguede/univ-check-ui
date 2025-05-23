import { CreateOrganizationInput, Organization, UpdateOrganizationInput } from "@/types/organization.types";
import { getAuthToken } from "@/utils/auth-utils";
import api from "@/utils/axios";

export class OrganizationService {
  static async getOrganizations(): Promise<Organization[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/organizations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des années académiques:", error);
      throw new Error("Impossible de récupérer les années académiques");
    }
  }

  static async getOrganizationById(id: string): Promise<Organization> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/organizations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'organisation ${id}:`, error);
      throw new Error("Impossible de récupérer l'organisation");
    }
  }

  static async createOrganization(input: CreateOrganizationInput): Promise<Organization> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.post("/api/v1/organizations", input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la création de l'organisation:", error);
      throw new Error("Impossible de créer l'organisation");
    }
  }

  static async updateOrganization(input: UpdateOrganizationInput): Promise<Organization> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { id, ...updateData } = input;
      const { data } = await api.put(`/api/v1/organizations/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'organisation ${input.id}:`, error);
      throw new Error("Impossible de mettre à jour l'organisation");
    }
  }

  static async deleteOrganization(id: string): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      await api.delete(`/api/v1/organizations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'organisation ${id}:`, error);
      throw new Error("Impossible de supprimer l'organisation");
    }
  }
}
