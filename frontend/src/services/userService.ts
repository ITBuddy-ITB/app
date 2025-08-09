import api from "../lib/api";
import { AxiosError } from "axios";
import type { User } from "./authService";

interface ErrorResponse {
  error: string;
}

export class UserService {
  // Get user by ID
  static async getUserById(id: number): Promise<User> {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to get user";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to get user");
    }
  }
}
