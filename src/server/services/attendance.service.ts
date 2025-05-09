import { Attendance, AttendanceResponse, Course, CreateAttendanceInput, UpdateAttendanceInput } from "@/types/attendance.types";
import { getAuthToken } from "@/utils/auth-utils";
import api from "@/utils/axios";

export class AttendanceService {
  static async getAttendances(page = 1, limit = 10): Promise<AttendanceResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/attendances`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des émargements:", error);
      throw new Error("Impossible de récupérer les émargements");
    }
  }

  static async getAttendanceById(id: string): Promise<Attendance> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/attendances/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'émargement ${id}:`, error);
      throw new Error("Impossible de récupérer l'émargement");
    }
  }

  static async createAttendance(input: CreateAttendanceInput): Promise<Attendance> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.post(`/api/v1/attendances`, input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la création de l'émargement:", error);
      throw new Error("Impossible de créer l'émargement");
    }
  }

  static async updateAttendance(input: UpdateAttendanceInput): Promise<Attendance> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { id, ...updateData } = input;
      const { data } = await api.patch(`/api/v1/attendances/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'émargement:`, error);
      throw new Error("Impossible de mettre à jour l'émargement");
    }
  }

  static async getProfessorAttendances(professorId: string): Promise<Attendance[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/attendances/professor/${professorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des émargements du professeur:`, error);
      throw new Error("Impossible de récupérer les émargements du professeur");
    }
  }

  static async getProfessorTodaysCourses(professorId: string): Promise<Course[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      // URL à adapter selon l'API réelle
      const { data } = await api.get(`/api/v1/courses/professor/${professorId}/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des cours du jour:`, error);
      throw new Error("Impossible de récupérer les cours du jour");
    }
  }
}
