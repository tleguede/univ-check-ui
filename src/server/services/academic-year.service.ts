import { AcademicYear, CreateAcademicYearInput, UpdateAcademicYearInput } from "@/types/academic-year.types";
import { getAuthToken } from "@/utils/auth-utils";
import api from "@/utils/axios";

export class AcademicYearService {
  static async getAcademicYears(): Promise<AcademicYear[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/academic-years`, {
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

  static async getAcademicYearById(id: string): Promise<AcademicYear> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/academic-years/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'année académique ${id}:`, error);
      throw new Error("Impossible de récupérer l'année académique");
    }
  }

  static async createAcademicYear(input: CreateAcademicYearInput): Promise<AcademicYear> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.post("/api/v1/academic-years", input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la création de l'année académique:", error);
      throw new Error("Impossible de créer l'année académique");
    }
  }

  static async updateAcademicYear(input: UpdateAcademicYearInput): Promise<AcademicYear> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { id, ...updateData } = input;
      const { data } = await api.patch(`/api/v1/academic-years/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'année académique ${input.id}:`, error);
      throw new Error("Impossible de mettre à jour l'année académique");
    }
  }

  static async deleteAcademicYear(id: string): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      await api.delete(`/api/v1/academic-years/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'année académique ${id}:`, error);
      throw new Error("Impossible de supprimer l'année académique");
    }
  }
}
