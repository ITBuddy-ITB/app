import api from "../lib/api";
import { AxiosError } from "axios";

// Base interfaces that match backend models
export interface Business {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
  user_id: number;
  name: string;
  type?: string;
  market_cap?: number;
  ebitda_multiplier?: number;
  description?: string;
  industry?: string;
  founded_at?: string;
  legals?: Legal[];
  products?: Product[];
  financials?: Financial[]; // All financial records
  financial?: Financial; // Latest financial record for compatibility
}

export interface Product {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
  business_id: number;
  name: string;
  product_legals?: ProductLegal[];
}

export interface Legal {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
  business_id: number;
  file_name?: string;
  file_url?: string;
  legal_type?: string;
  issued_by?: string;
  issued_at?: string;
  valid_until?: string;
  notes?: string;
}

export interface ProductLegal {
  required: boolean;
  product_name: string;
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
  product_id: number;
  file_name?: string;
  file_url?: string;
  legal_type?: string;
  issued_by?: string;
  issued_at?: string;
  valid_until?: string;
  notes?: string;
}

export interface Financial {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
  business_id: number;
  revenue?: number;
  ebitda?: number;
  assets?: number;
  liabilities?: number;
  equity?: number;
  report_file?: string;
  notes?: string;
}

export interface BusinessAdditionalInfo {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
  business_id: number;
  name: string;
  value: string;
}

export interface RequiredLegal {
  type: string;
  has_legal: boolean;
  notes?: string;
  steps?: LegalStep[];
}

export interface ProductLegalRequirement {
  product_name: string;
  required: RequiredLegal[];
}

export interface LegalComparison {
  required: RequiredLegal[];
  products: ProductLegalRequirement[];
}

export interface LegalStep {
  step_number: number;
  description: string;
  redirect_url: string;
}

// Request/Response interfaces
export interface CreateBusinessRequestData {
  name: string;
  type?: string;
  market_cap?: number;
  description?: string;
  industry?: string;
  founded_at?: string;
}

export interface CreateBusinessAdditionalInfo {
  name: string;
  value: string;
}

export interface CreateBusinessRequest {
  user_id: number;
  business: CreateBusinessRequestData;
  additional_info?: CreateBusinessAdditionalInfo[];
  products?: Omit<Product, "ID" | "CreatedAt" | "UpdatedAt" | "DeletedAt" | "business_id">[];
}

export interface CreateBusinessResponse {
  message: string;
  business: Business;
}

export interface AddProductsRequest {
  products: Omit<Product, "ID" | "CreatedAt" | "UpdatedAt" | "DeletedAt" | "business_id">[];
}

export interface AddProductsResponse {
  message: string;
  products: Product[];
}

interface ErrorResponse {
  error: string;
}

export class BusinessService {
  // Get all businesses for the current user
  static async getUserBusinesses(): Promise<Business[]> {
    try {
      const response = await api.get<Business[]>("/business/user");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to fetch businesses";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch businesses");
    }
  }

  // Get a specific business by ID
  static async getBusinessById(businessId: number): Promise<Business> {
    try {
      const response = await api.get<Business>(`/business/${businessId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Business not found";
        throw new Error(errorMessage);
      }
      throw new Error("Business not found");
    }
  }

  // Create a new business
  static async createBusiness(data: CreateBusinessRequest): Promise<CreateBusinessResponse> {
    try {
      const response = await api.post<CreateBusinessResponse>("/business", data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to create business";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to create business");
    }
  }

  // Update business basic info
  static async updateBusiness(
    businessId: number,
    data: Partial<Business>
  ): Promise<{ message: string; business: Business }> {
    try {
      const response = await api.put<{ message: string; business: Business }>(`/business/${businessId}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to update business";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to update business");
    }
  }

  // Delete a business
  static async deleteBusiness(businessId: number): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(`/business/${businessId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to delete business";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to delete business");
    }
  }

  // Product Management
  static async getBusinessProducts(businessId: number): Promise<Product[]> {
    try {
      const response = await api.get<Product[]>(`/business/${businessId}/products`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to fetch products";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch products");
    }
  }

  static async addBusinessProducts(businessId: number, data: AddProductsRequest): Promise<AddProductsResponse> {
    try {
      const response = await api.post<AddProductsResponse>(`/business/${businessId}/products`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to add products";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to add products");
    }
  }

  static async updateBusinessProduct(
    businessId: number,
    productId: number,
    data: Partial<Product>
  ): Promise<{ message: string }> {
    try {
      const response = await api.put<{ message: string }>(`/business/${businessId}/products/${productId}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to update product";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to update product");
    }
  }

  static async deleteBusinessProduct(businessId: number, productId: number): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(`/business/${businessId}/products/${productId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to delete product";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to delete product");
    }
  }

  // Legal Document Management
  static async getBusinessLegal(businessId: number): Promise<Legal[]> {
    try {
      const response = await api.get<Legal[]>(`/business/${businessId}/legal`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to fetch legal documents";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch legal documents");
    }
  }

  static async addBusinessLegal(businessId: number, formData: FormData): Promise<Legal> {
    try {
      const response = await api.post<Legal>(`/business/${businessId}/legal`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to add legal document";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to add legal document");
    }
  }

  static async getProductsLegal(businessId: number): Promise<ProductLegal[]> {
    try {
      const response = await api.get<ProductLegal[]>(`/business/${businessId}/products/legal`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          (error.response?.data as ErrorResponse)?.error || "Failed to fetch product legal documents";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch product legal documents");
    }
  }

  static async addProductLegal(businessId: number, productId: number, formData: FormData): Promise<ProductLegal> {
    try {
      const response = await api.post<ProductLegal>(`/business/${businessId}/products/${productId}/legal`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to add product legal document";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to add product legal document");
    }
  }

  // Financial Data Management
  static async getBusinessFinancial(businessId: number): Promise<Financial> {
    try {
      const response = await api.get<Financial>(`/business/${businessId}/financial`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to fetch financial data";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch financial data");
    }
  }

  static async updateBusinessFinancial(businessId: number, data: Partial<Financial>): Promise<Financial> {
    try {
      const response = await api.put<Financial>(`/business/${businessId}/financial`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to update financial data";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to update financial data");
    }
  }

  // Get business financial history
  static async getBusinessFinancialHistory(businessId: number): Promise<Financial[]> {
    try {
      const response = await api.get<Financial[]>(`/business/${businessId}/financial/history`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = (error.response?.data as ErrorResponse)?.error || "Failed to fetch financial history";
        throw new Error(errorMessage);
      }
      throw new Error("Failed to fetch financial history");
    }
  }
}
