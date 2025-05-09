import { Course, CreateCourseInput, UpdateCourseInput } from "@/types/course.types";
import { getAuthToken } from "@/utils/auth-utils";
import api from "@/utils/axios";

export class CourseService {
  static async getCourses(): Promise<Course[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des cours:", error);
      throw new Error("Impossible de récupérer les cours");
    }
  }

  static async getCourseById(id: string): Promise<Course> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.get(`/api/v1/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du cours ${id}:`, error);
      throw new Error("Impossible de récupérer le cours");
    }
  }

  static async createCourse(input: CreateCourseInput): Promise<Course> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { data } = await api.post("/api/v1/courses", input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la création du cours:", error);
      throw new Error("Impossible de créer le cours");
    }
  }

  static async updateCourse(input: UpdateCourseInput): Promise<Course> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      const { id, ...updateData } = input;
      const { data } = await api.put(`/api/v1/courses/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du cours ${input.id}:`, error);
      throw new Error("Impossible de mettre à jour le cours");
    }
  }

  static async deleteCourse(id: string): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette ressource");
      }

      await api.delete(`/api/v1/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Erreur lors de la suppression du cours ${id}:`, error);
      throw new Error("Impossible de supprimer le cours");
    }
  }
}