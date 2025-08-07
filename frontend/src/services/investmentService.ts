import api from "../lib/api";
import { AxiosError } from "axios";

// Import business interfaces from business service
import type { Business } from "./businessService";

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
}
