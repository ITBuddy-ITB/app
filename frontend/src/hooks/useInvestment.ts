import { useState, useCallback } from "react";
import {
  InvestmentService,
  type PaginatedBusinessResponse,
  type GetAllBusinessesParams,
} from "../services/investmentService";
import type { Business } from "../services/businessService";

export const useInvestment = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchBusinesses = useCallback(async (params: GetAllBusinessesParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedBusinessResponse = await InvestmentService.getAllBusinesses(params);
      setBusinesses(response.businesses);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch businesses");
    } finally {
      setLoading(false);
    }
  }, []);

  const getBusinessDetails = useCallback(async (businessId: number): Promise<Business | null> => {
    try {
      setError(null);
      return await InvestmentService.getBusinessForInvestment(businessId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch business details");
      return null;
    }
  }, []);

  const searchBusinesses = useCallback(
    async (searchTerm: string, filters: Omit<GetAllBusinessesParams, "search"> = {}) => {
      await fetchBusinesses({ ...filters, search: searchTerm, page: 1 });
    },
    [fetchBusinesses]
  );

  const changePage = useCallback(
    async (newPage: number, filters: Omit<GetAllBusinessesParams, "page"> = {}) => {
      await fetchBusinesses({ ...filters, page: newPage });
    },
    [fetchBusinesses]
  );

  const changeLimit = useCallback(
    async (newLimit: number, filters: Omit<GetAllBusinessesParams, "limit"> = {}) => {
      await fetchBusinesses({ ...filters, limit: newLimit, page: 1 });
    },
    [fetchBusinesses]
  );

  return {
    businesses,
    loading,
    error,
    pagination,
    fetchBusinesses,
    getBusinessDetails,
    searchBusinesses,
    changePage,
    changeLimit,
  };
};
