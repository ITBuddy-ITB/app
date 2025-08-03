import api from "../lib/api";
import { AxiosError } from "axios";

// Import business interfaces from business service
import type { Business } from "./businessService";

// Investment-specific interfaces
export interface Investment {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
  investor_id: number;
  business_id: number;
  amount: number;
  investment_date: string;
  investment_type?: string;
  equity_percentage?: number;
  status?: string;
  notes?: string;
  business?: Business;
}

export interface PaginatedBusinessResponse {
  businesses: Business[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllBusinessesParams {
  page?: number;
  limit?: number;
  industry?: string;
  search?: string;
}

interface ErrorResponse {
  error: string;
}

export class InvestmentService {
  // Get all businesses available for investment with pagination
  static async getAllBusinesses(params: GetAllBusinessesParams = {}): Promise<PaginatedBusinessResponse> {
    try {
      const { page = 1, limit = 10, industry, search } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (industry) queryParams.append("industry", industry);
      if (search) queryParams.append("search", search);

      const response = await api.get<PaginatedBusinessResponse>(`/investment/businesses?${queryParams}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          (error.response?.data as ErrorResponse)?.error || "Failed to fetch businesses for investment";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch businesses for investment");
    }
  }

  // Get detailed business info for investment
  static async getBusinessForInvestment(businessId: number): Promise<Business> {
    try {
      const response = await api.get<Business>(`/investment/businesses/${businessId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to fetch business details";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch business details");
    }
  }

  // Create an investment
  static async createInvestment(
    investment: Omit<Investment, "ID" | "CreatedAt" | "UpdatedAt" | "DeletedAt">
  ): Promise<Investment> {
    try {
      const response = await api.post<Investment>("/investment", investment);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to create investment";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to create investment");
    }
  }

  // Get user's investments
  static async getUserInvestments(): Promise<Investment[]> {
    try {
      const response = await api.get<Investment[]>("/investment/user");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to fetch user investments";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch user investments");
    }
  }

  // Get investments for a specific business
  static async getBusinessInvestments(businessId: number): Promise<Investment[]> {
    try {
      const response = await api.get<Investment[]>(`/investment/business/${businessId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to fetch business investments";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch business investments");
    }
  }
}
