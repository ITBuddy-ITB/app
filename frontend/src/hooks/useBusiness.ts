import { useState } from "react";
import { BusinessService, type CreateBusinessRequest } from "../services/businessService";

interface Business {
  name: string;
  type: string;
  marketCap: string;
  description: string;
  industry: string;
  foundedAt: string;
}

interface BusinessAdditionalInfo {
  name: string;
  value: string;
}

interface Product {
  name: string;
}

export const useBusiness = () => {
  const [business, setBusiness] = useState<Business>({
    name: "",
    type: "",
    marketCap: "",
    description: "",
    industry: "",
    foundedAt: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState<BusinessAdditionalInfo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- Additional Info ----------
  const addAdditionalInfo = () => setAdditionalInfo([...additionalInfo, { name: "", value: "" }]);
  const updateAdditionalInfo = (i: number, field: keyof BusinessAdditionalInfo, value: string) => {
    const updated = [...additionalInfo];
    updated[i] = { ...updated[i], [field]: value };
    setAdditionalInfo(updated);
  };
  const removeAdditionalInfo = (i: number) => setAdditionalInfo(additionalInfo.filter((_, idx) => idx !== i));

  // ---------- Products ----------
  const addProduct = () => setProducts([...products, { name: "" }]);
  const updateProduct = (i: number, field: keyof Product, value: string) => {
    const updated = [...products];
    updated[i] = { ...updated[i], [field]: value };
    setProducts(updated);
  };
  const removeProduct = (i: number) => setProducts(products.filter((_, idx) => idx !== i));

  // ---------- Submit ----------
  const submitBusiness = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload: CreateBusinessRequest = {
        user_id: 1, // TODO: Replace with real logged-in user
        business: {
          name: business.name,
          type: business.type,
          market_cap: business.marketCap ? parseFloat(business.marketCap) : undefined,
          description: business.description,
          industry: business.industry,
          founded_at: business.foundedAt || undefined,
        },
        additional_info: additionalInfo,
        products: [], // Products will be added later in business detail page
      };

      const result = await BusinessService.createBusiness(payload);

      console.log("Business saved:", result);
      return result.business;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error saving business:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    business,
    setBusiness,
    additionalInfo,
    addAdditionalInfo,
    updateAdditionalInfo,
    removeAdditionalInfo,
    products,
    addProduct,
    updateProduct,
    removeProduct,
    submitBusiness,
    loading,
    error,
  };
};
