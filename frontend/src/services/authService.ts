import api from "../lib/api";
import { AxiosError } from "axios";

export interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterData {
  username: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

interface ErrorResponse {
  error: string;
}

export class AuthService {
  // Register a new user
  static async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>("/register", data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Registration failed";
        throw new Error(errorMessage);
      }
      throw new Error("Registration failed");
    }
  }

  // Login user
  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/login", data);

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Login failed";
        throw new Error(errorMessage);
      }
      throw new Error("Login failed");
    }
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  // Get current token
  static getToken(): string | null {
    return localStorage.getItem("token");
  }
}
