import {
  Attendance,
  AttendanceResponse,
  ClassSession,
  ClassSessionResponse,
  Course,
  CreateAttendanceInput,
  CreateClassSessionInput,
  CreateEmargementInput,
  Emargement,
  UpdateAttendanceInput,
  UpdateClassSessionInput,
  UpdateEmargementInput,
} from "@/types/attendance.types";
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
      const { data } = await api.get(`/api/v1/class-sessions/professor/${professorId}/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Transformer les données pour correspondre au type Course[]
      return data.map((session: any) => ({
        id: session.id,
        title: session.course?.title || 'Sans titre',
        startTime: session.heureDebut,
        endTime: session.heureFin,
        location: session.location || 'Non spécifié',
        hasAttendance: !!session.emargement,
      }));
    } catch (error) {
      console.error(`Erreur lors de la récupération des cours du jour pour le professeur ${professorId}:`, error);
      throw new Error("Impossible de récupérer les cours du jour");
    }
  }

  // Méthodes pour les sessions de cours
  static async getClassSessions(page = 1, limit = 10): Promise<ClassSessionResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/class-sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des sessions de cours:", error);
      throw new Error("Impossible de récupérer les sessions de cours");
    }
  }

  static async getClassSessionById(id: string): Promise<ClassSession> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/class-sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la session de cours ${id}:`, error);
      throw new Error("Impossible de récupérer les détails de la session de cours");
    }
  }

  static async createClassSession(input: CreateClassSessionInput): Promise<ClassSession> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.post(`/api/v1/class-sessions`, input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la création de la session de cours:", error);
      throw new Error("Impossible de créer la session de cours");
    }
  }

  static async updateClassSession(input: UpdateClassSessionInput): Promise<ClassSession> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { id, ...updateData } = input;
      const { data } = await api.put(`/api/v1/class-sessions/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la session de cours ${input.id}:`, error);
      throw new Error("Impossible de mettre à jour la session de cours");
    }
  }

  static async deleteClassSession(id: string): Promise<boolean> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      await api.delete(`/api/v1/class-sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la session de cours ${id}:`, error);
      throw new Error("Impossible de supprimer la session de cours");
    }
  }
  static async getProfessorClassSessions(professorId: string, startDate?: string, endDate?: string): Promise<ClassSession[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const params: Record<string, string> = { professorId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { data } = await api.get(`/api/v1/class-sessions/professor/${professorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des sessions de cours pour le professeur ${professorId}:`, error);
      throw new Error("Impossible de récupérer les sessions de cours du professeur");
    }
  }
  static async getEmargements(
    page = 1, 
    limit = 10, 
    filters?: {
      professorName?: string;
      courseTitle?: string;
      dateFrom?: Date | string;
      dateTo?: Date | string;
      status?: string;
    }
  ): Promise<{ emargements: Emargement[]; total: number }> {
    return EmargementService.getEmargements(page, limit, filters);
  }

  static async getEmargementById(id: string): Promise<Emargement> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/emargements/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'émargement ${id}:`, error);
      throw new Error("Impossible de récupérer les détails de l'émargement");
    }
  }

  static async createEmargement(input: CreateEmargementInput): Promise<Emargement> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.post(`/api/v1/emargements`, input, {
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

  static async updateEmargement(input: UpdateEmargementInput): Promise<Emargement> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { id, ...updateData } = input;
      const { data } = await api.put(`/api/v1/emargements/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'émargement ${input.id}:`, error);
      throw new Error("Impossible de mettre à jour l'émargement");
    }
  }

  static async updateEmargementStatus(id: string, status: string): Promise<boolean> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      await api.patch(`/api/v1/emargements/status/${id}/${status}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return true;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de l'émargement ${id}:`, error);
      throw new Error("Impossible de mettre à jour le statut de l'émargement");
    }
  }

  // Méthode pour récupérer les cours du professeur pour une semaine donnée
  static async getProfessorWeekCourses(professorId: string, startDate: string): Promise<Course[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/class-sessions/professor/${professorId}/week`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { startDate },
      });

      // Transformer les données pour correspondre au type Course[]
      return data.map((session: any) => ({
        id: session.id,
        title: session.course?.title || 'Sans titre',
        startTime: session.heureDebut,
        endTime: session.heureFin,
        location: session.location || 'Non spécifié',
        hasAttendance: !!session.emargement,
      }));
    } catch (error) {
      console.error(`Erreur lors de la récupération des cours de la semaine pour le professeur ${professorId}:`, error);
      throw new Error("Impossible de récupérer les cours de la semaine");
    }
  }
}
