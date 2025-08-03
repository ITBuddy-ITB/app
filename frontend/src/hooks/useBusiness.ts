import { useState } from "react";
import api from "../lib/api";

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
  description: string;
  category: string;
  hpp?: number;
  revenue?: number;
  profit?: number;
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
  const addProduct = () => setProducts([...products, { name: "", description: "", category: "" }]);
  const updateProduct = (i: number, field: keyof Product, value: string | number) => {
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

      const payload = {
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
        products: products.map((p) => ({
          name: p.name,
          description: p.description,
          category: p.category,
          hpp: p.hpp || undefined,
          revenue: p.revenue || undefined,
          profit: p.profit || undefined,
        })),
      };

      const res = await api.post("/business", payload);

      console.log("Business saved:", res.data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error saving business:", err);
      setError(err.response?.data?.error || err.message || "Something went wrong");
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
