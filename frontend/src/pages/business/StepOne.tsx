import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import StepIndicator from "../../components/StepIndicator";
import { X } from "lucide-react";

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

const Step1Page: React.FC = () => {
  // Business state
  const [business, setBusiness] = useState({
    name: "",
    type: "",
    marketCap: "",
    description: "",
    industry: "",
    foundedAt: "",
  });

  // Additional Info
  const [additionalInfo, setAdditionalInfo] = useState<BusinessAdditionalInfo[]>([]);

  // Products
  const [products, setProducts] = useState<Product[]>([]);

  // Add / Remove additional info
  const addAdditionalInfo = () => {
    setAdditionalInfo([...additionalInfo, { name: "", value: "" }]);
  };
  const updateAdditionalInfo = (index: number, field: keyof BusinessAdditionalInfo, value: string) => {
    const updated = [...additionalInfo];
    updated[index] = { ...updated[index], [field]: value };
    setAdditionalInfo(updated);
  };
  const removeAdditionalInfo = (index: number) => {
    setAdditionalInfo(additionalInfo.filter((_, i) => i !== index));
  };

  // Add / Update / Remove product
  const addProduct = () => {
    setProducts([...products, { name: "", description: "", category: "" }]);
  };
  const updateProduct = (index: number, field: keyof Product, value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };
  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      business,
      additionalInfo,
      products,
    };
    console.log("Step 1 Payload:", payload);

    // TODO: Send to backend
    // navigate("/business/step-2");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Step Indicator */}
        <StepIndicator />

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Business & Products Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Business Profile */}
          <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Business Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name *</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  value={business.name}
                  onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Type</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  value={business.type}
                  onChange={(e) => setBusiness({ ...business, type: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Market Cap</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-4 py-2"
                  value={business.marketCap}
                  onChange={(e) => setBusiness({ ...business, marketCap: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  value={business.industry}
                  onChange={(e) => setBusiness({ ...business, industry: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Founded At</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-4 py-2"
                  value={business.foundedAt}
                  onChange={(e) => setBusiness({ ...business, foundedAt: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="w-full border rounded-lg px-4 py-2"
                rows={3}
                value={business.description}
                onChange={(e) => setBusiness({ ...business, description: e.target.value })}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Additional Info (Optional)</h3>
            {additionalInfo.map((info, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Key</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    value={info.name}
                    onChange={(e) => updateAdditionalInfo(index, "name", e.target.value)}
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-4 py-2"
                      value={info.value}
                      onChange={(e) => updateAdditionalInfo(index, "value", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAdditionalInfo(index)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addAdditionalInfo} className="text-blue-600 hover:underline text-sm">
              + Add Key-Value
            </button>
          </div>

          {/* Products */}
          <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Products</h3>
            {products.map((product, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-2 relative">
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full">
                  <X size={16} />
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    value={product.name}
                    onChange={(e) => updateProduct(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Description</label>
                  <textarea
                    className="w-full border rounded-lg px-4 py-2"
                    rows={2}
                    value={product.description}
                    onChange={(e) => updateProduct(index, "description", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    value={product.category}
                    onChange={(e) => updateProduct(index, "category", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">HPP</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-4 py-2"
                      value={product.hpp || ""}
                      onChange={(e) => updateProduct(index, "hpp", parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Revenue</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-4 py-2"
                      value={product.revenue || ""}
                      onChange={(e) => updateProduct(index, "revenue", parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profit</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-4 py-2"
                      value={product.profit || ""}
                      onChange={(e) => updateProduct(index, "profit", parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addProduct} className="text-blue-600 hover:underline text-sm">
              + Add Product
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              Save & Continue to Step 2
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step1Page;
