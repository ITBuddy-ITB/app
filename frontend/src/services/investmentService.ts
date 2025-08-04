import api from "../lib/api";
import { AxiosError } from "axios";

// Import business interfaces from business service
import type { Business } from "./businessService";

// Investment status constants (matching backend model)
export const INVESTMENT_STATUS = {
  BUYING: "buying", // Default status when investment is created
  PENDING: "pending", // Investor has requested to invest
  APPROVED: "approved", // Business or platform has approved the investment
  FUNDED: "funded", // Funds have been transferred successfully
  ACTIVE: "active", // Investment is currently held (business is using funds)
  EXITED: "exited", // Investment has been sold or exited (investor got return)
  REJECTED: "rejected", // Business/platform rejected the investment
  CANCELLED: "cancelled", // Investor cancelled before approval
} as const;

export type InvestmentStatus = (typeof INVESTMENT_STATUS)[keyof typeof INVESTMENT_STATUS];

// Investment-specific interfaces (matching backend model)
export interface Investment {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
  investor_id: number;
  business_id: number;
  time_bought?: string; // Optional timestamp when investment becomes active
  time_sold?: string; // Optional timestamp when investment is exited
  investment_amount: number; // Backend expects this as a float64 (number)
  investment_status: string; // Default is "buying" from backend
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
    investment: Omit<
      Investment,
      // "ID" | "CreatedAt" | "UpdatedAt" | "DeletedAt" | "investor_id" | "investment_status" | "time_bought" | "time_sold" // For Prod
      "ID" | "CreatedAt" | "UpdatedAt" | "DeletedAt" | "investor_id" | "time_sold"
    >
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

  // Get user's investments for a specific business
  static async getUserInvestmentsForBusiness(businessId: number): Promise<Investment[]> {
    try {
      const response = await api.get<Investment[]>(`/investment/user/business/${businessId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          (error.response?.data as ErrorResponse)?.error || "Failed to fetch user investments for business";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch user investments for business");
    }
  }

  // Update investment status
  static async updateInvestmentStatus(investmentId: number, status: string): Promise<Investment> {
    try {
      const response = await api.patch<Investment>(`/investment/${investmentId}/status`, {
        investment_status: status,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to update investment status";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to update investment status");
    }
  }
}
