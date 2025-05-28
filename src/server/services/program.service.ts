import { CreateProgramInput, Program, UpdateProgramInput } from "@/types/program.types";
import { getAuthToken } from "@/utils/auth-utils";
import api from "@/utils/axios";

export class ProgramService {
  static async getPrograms(): Promise<Program[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/programs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des programmes:", error);
      throw new Error("Impossible de récupérer les programmes");
    }
  }

  static async getProgramById(id: string): Promise<Program> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/programs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du programme ${id}:`, error);
      throw new Error("Impossible de récupérer le programme");
    }
  }

  static async createProgram(input: CreateProgramInput): Promise<Program> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.post("/api/v1/programs", input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la création du programme:", error);
      throw new Error("Impossible de créer le programme");
    }
  }

  static async updateProgram(input: UpdateProgramInput): Promise<Program> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { id, ...updateData } = input;
      const { data } = await api.put(`/api/v1/programs/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du programme ${input.id}:`, error);
      throw new Error("Impossible de mettre à jour le programme");
    }
  }

  static async deleteProgram(id: string): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      await api.delete(`/api/v1/programs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Erreur lors de la suppression du programme ${id}:`, error);
      throw new Error("Impossible de supprimer le programme");
    }
  }
}