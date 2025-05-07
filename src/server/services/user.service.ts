import { User } from "@/types/user.types";
import api from "@/utils/axios";

export class UserService {
  static async getUsers(): Promise<User[]> {
    const token = localStorage.getItem("auth-user") ? JSON.parse(localStorage.getItem("auth-user")!).token : null;
    if (!token) throw new Error("Non authentifié");
    const { data } = await api.get(`/api/v1/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }

  static async getUserById(id: string): Promise<User> {
    const token = localStorage.getItem("auth-user") ? JSON.parse(localStorage.getItem("auth-user")!).token : null;
    if (!token) throw new Error("Non authentifié");
    const { data } = await api.get(`/api/v1/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }

  static async createUser(input: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const token = localStorage.getItem("auth-user") ? JSON.parse(localStorage.getItem("auth-user")!).token : null;
    if (!token) throw new Error("Non authentifié");
    const { data } = await api.post(`/api/v1/users`, input, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }

  static async updateUser(user: User): Promise<User> {
    const token = localStorage.getItem("auth-user") ? JSON.parse(localStorage.getItem("auth-user")!).token : null;
    if (!token) throw new Error("Non authentifié");
    const { id, ...updateData } = user;
    const { data } = await api.patch(`/api/v1/users/${id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }

  static async deleteUser(id: string): Promise<void> {
    const token = localStorage.getItem("auth-user") ? JSON.parse(localStorage.getItem("auth-user")!).token : null;
    if (!token) throw new Error("Non authentifié");
    await api.delete(`/api/v1/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
