import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import StepIndicator from "../../components/StepIndicator";
import { X } from "lucide-react";
import { useNavigate } from "react-router";

interface Legal {
  fileName: string;
  file?: File;
  legalType: string;
  issuedBy: string;
  issuedAt?: string;
  validUntil?: string;
  notes: string;
}

interface Product {
  id: number;
  name: string;
}

const Step2Page: React.FC = () => {
  const navigate = useNavigate();

  // Predefined required business legals (fake data for now)
  const predefinedBusinessLegals: Legal[] = [
    { legalType: "Business License", fileName: "", issuedBy: "", notes: "" },
    { legalType: "Tax Registration", fileName: "", issuedBy: "", notes: "" },
  ];

  // Predefined products (fake, in real app load from backend / Step 1 saved data)
  const [products] = useState<Product[]>([
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
  ]);

  // Predefined required product legals
  const predefinedProductLegals: Record<number, Legal[]> = {
    1: [
      { legalType: "Halal Certificate", fileName: "", issuedBy: "", notes: "" },
      { legalType: "BPOM Approval", fileName: "", issuedBy: "", notes: "" },
    ],
    2: [{ legalType: "Patent", fileName: "", issuedBy: "", notes: "" }],
  };

  // State
  const [businessLegals, setBusinessLegals] = useState<Legal[]>(predefinedBusinessLegals);
  const [productLegals, setProductLegals] = useState<Record<number, Legal[]>>(predefinedProductLegals);

  // Handlers for Business Legals
  const updateBusinessLegal = (index: number, field: keyof Legal, value: unknown) => {
    const updated = [...businessLegals];
    updated[index] = { ...updated[index], [field]: value };
    setBusinessLegals(updated);
  };
  const addBusinessLegal = () => {
    setBusinessLegals([...businessLegals, { legalType: "", fileName: "", issuedBy: "", notes: "" }]);
  };
  const removeBusinessLegal = (index: number) => {
    setBusinessLegals(businessLegals.filter((_, i) => i !== index));
  };

  // Handlers for Product Legals
  const updateProductLegal = (productId: number, index: number, field: keyof Legal, value: unknown) => {
    const updated = [...(productLegals[productId] || [])];
    updated[index] = { ...updated[index], [field]: value };
    setProductLegals({ ...productLegals, [productId]: updated });
  };
  const addProductLegal = (productId: number) => {
    setProductLegals((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), { legalType: "", fileName: "", issuedBy: "", notes: "" }],
    }));
  };
  const removeProductLegal = (productId: number, index: number) => {
    setProductLegals((prev) => ({
      ...prev,
      [productId]: prev[productId].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      businessLegals,
      productLegals,
    };

    console.log("Step 2 Payload:", payload);

    // TODO: send to backend
    // navigate("/business/step-3");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-4xl mx-auto py-10 px-4">
        <StepIndicator />

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Business & Product Legals</h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Business Legals */}
          <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Business Legals</h3>
            {businessLegals.map((legal, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 relative">
                {/* Cancel button even for predefined */}
                <button
                  type="button"
                  onClick={() => removeBusinessLegal(index)}
                  className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full">
                  <X size={16} />
                </button>

                <label className="block text-sm font-medium text-gray-700">Legal Type</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  value={legal.legalType}
                  onChange={(e) => updateBusinessLegal(index, "legalType", e.target.value)}
                />

                <div className="border border-dashed border-gray-300 rounded-lg p-3">
                  <label className="block text-sm font-medium text-gray-700">Upload PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="w-full"
                    onChange={(e) => updateBusinessLegal(index, "file", e.target.files?.[0] || null)}
                  />
                </div>

                <label className="block text-sm font-medium text-gray-700">Issued By</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2"
                  value={legal.issuedBy}
                  onChange={(e) => updateBusinessLegal(index, "issuedBy", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Issued At</label>
                    <input
                      type="date"
                      className="w-full border rounded-lg px-4 py-2"
                      value={legal.issuedAt || ""}
                      onChange={(e) => updateBusinessLegal(index, "issuedAt", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                    <input
                      type="date"
                      className="w-full border rounded-lg px-4 py-2"
                      value={legal.validUntil || ""}
                      onChange={(e) => updateBusinessLegal(index, "validUntil", e.target.value)}
                    />
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="w-full border rounded-lg px-4 py-2"
                  rows={2}
                  value={legal.notes}
                  onChange={(e) => updateBusinessLegal(index, "notes", e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={addBusinessLegal} className="text-blue-600 hover:underline text-sm">
              + Add More Business Legal
            </button>
          </div>

          {/* Product Legals */}
          <div className="bg-white shadow rounded-lg p-6 space-y-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Product Legals</h3>
            {products.map((product) => (
              <div key={product.id} className="space-y-4">
                <h4 className="text-md font-semibold text-gray-700">{product.name}</h4>
                {(productLegals[product.id] || []).map((legal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 relative">
                    {/* Cancel button for all legals */}
                    <button
                      type="button"
                      onClick={() => removeProductLegal(product.id, index)}
                      className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full">
                      <X size={16} />
                    </button>

                    <label className="block text-sm font-medium text-gray-700">Legal Type</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-4 py-2"
                      value={legal.legalType}
                      onChange={(e) => updateProductLegal(product.id, index, "legalType", e.target.value)}
                    />

                    <div className="border border-dashed border-gray-300 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700">Upload PDF</label>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="w-full"
                        onChange={(e) => updateProductLegal(product.id, index, "file", e.target.files?.[0] || null)}
                      />
                    </div>

                    <label className="block text-sm font-medium text-gray-700">Issued By</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-4 py-2"
                      value={legal.issuedBy}
                      onChange={(e) => updateProductLegal(product.id, index, "issuedBy", e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Issued At</label>
                        <input
                          type="date"
                          className="w-full border rounded-lg px-4 py-2"
                          value={legal.issuedAt || ""}
                          onChange={(e) => updateProductLegal(product.id, index, "issuedAt", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                        <input
                          type="date"
                          className="w-full border rounded-lg px-4 py-2"
                          value={legal.validUntil || ""}
                          onChange={(e) => updateProductLegal(product.id, index, "validUntil", e.target.value)}
                        />
                      </div>
                    </div>

                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      className="w-full border rounded-lg px-4 py-2"
                      rows={2}
                      value={legal.notes}
                      onChange={(e) => updateProductLegal(product.id, index, "notes", e.target.value)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addProductLegal(product.id)}
                  className="text-blue-600 hover:underline text-sm">
                  + Add More Legal for {product.name}
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/business/suggestions")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              View AI Suggestions
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              Save & Continue to Step 3
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2Page;
