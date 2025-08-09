import React, { useState } from "react";
import { motion } from "framer-motion";
import StepIndicator from "../../components/StepIndicator";
import { X, Scale, FileText, Upload, Trophy, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-brown-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-brown-primary/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-brown-accent/30 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-brown-primary/25 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto py-10 px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <StepIndicator />
        </motion.div>

        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <motion.div className="flex items-center justify-center mb-4" animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 8 }}>
            <Scale className="w-8 h-8 text-brown-accent" />
          </motion.div>
          <h2 className="text-3xl font-bold text-brown-primary mb-2 drop-shadow-sm">Step 2: Business & Product Legals</h2>
          <p className="text-brown-text/70">Upload legal documents to strengthen your business profile</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          {/* Business Legals */}
          <motion.div
            className="relative bg-brown-bg-light/80 backdrop-blur-sm shadow-xl rounded-xl p-6 space-y-4 border border-brown-bg/30 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute top-4 right-4 w-16 h-16 bg-brown-primary/20 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <motion.h3
              className="relative text-lg font-semibold text-brown-primary flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3,
                }}>
                <FileText className="w-5 h-5 mr-2 text-brown-accent" />
              </motion.div>
              Business Legals
            </motion.h3>

            {businessLegals.map((legal, index) => (
              <motion.div
                key={index}
                className="relative border border-brown-bg/40 rounded-lg p-4 space-y-3 bg-white/50 backdrop-blur-sm shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(96, 42, 29, 0.1)" }}>
                {/* Cancel button even for predefined */}
                <motion.button
                  type="button"
                  onClick={() => removeBusinessLegal(index)}
                  className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}>
                  <X size={16} />
                </motion.button>

                <label className="block text-sm font-medium text-brown-primary">Legal Type</label>
                <input
                  type="text"
                  className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                  value={legal.legalType}
                  onChange={(e) => updateBusinessLegal(index, "legalType", e.target.value)}
                />

                <motion.div
                  className="border-2 border-dashed border-brown-bg/30 rounded-lg p-3 bg-brown-bg-light/30 backdrop-blur-sm hover:border-brown-accent/50 transition-all duration-300"
                  whileHover={{ scale: 1.01 }}>
                  <label className="text-sm font-medium text-brown-primary mb-2 flex items-center">
                    <Upload className="w-4 h-4 mr-1" />
                    Upload PDF
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="w-full text-brown-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brown-accent file:text-white hover:file:bg-brown-accent/90 file:transition-all file:duration-200"
                    onChange={(e) => updateBusinessLegal(index, "file", e.target.files?.[0] || null)}
                  />
                </motion.div>

                <label className="block text-sm font-medium text-brown-primary">Issued By</label>
                <input
                  type="text"
                  className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                  value={legal.issuedBy}
                  onChange={(e) => updateBusinessLegal(index, "issuedBy", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brown-primary">Issued At</label>
                    <input
                      type="date"
                      className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                      value={legal.issuedAt || ""}
                      onChange={(e) => updateBusinessLegal(index, "issuedAt", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-primary">Valid Until</label>
                    <input
                      type="date"
                      className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                      value={legal.validUntil || ""}
                      onChange={(e) => updateBusinessLegal(index, "validUntil", e.target.value)}
                    />
                  </div>
                </div>

                <label className="block text-sm font-medium text-brown-primary">Notes</label>
                <textarea
                  className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text resize-none"
                  rows={2}
                  value={legal.notes}
                  onChange={(e) => updateBusinessLegal(index, "notes", e.target.value)}
                  placeholder="Additional notes or comments..."
                />
              </motion.div>
            ))}
            <motion.button
              type="button"
              onClick={addBusinessLegal}
              className="text-brown-primary hover:text-brown-accent text-sm font-medium flex items-center transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Sparkles className="w-4 h-4 mr-1" />+ Add More Business Legal
            </motion.button>
          </motion.div>

          {/* Product Legals */}
          <motion.div
            className="relative bg-brown-bg-light/80 backdrop-blur-sm shadow-xl rounded-xl p-6 space-y-6 border border-brown-bg/30 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute bottom-4 left-4 w-20 h-20 bg-brown-accent/20 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>

            <motion.h3
              className="relative text-lg font-semibold text-brown-primary flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}>
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 10 }}>
                <Trophy className="w-5 h-5 mr-2 text-brown-accent" />
              </motion.div>
              Product Legals
            </motion.h3>

            {products.map((product, productIndex) => (
              <motion.div key={product.id} className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.3 + productIndex * 0.1 }}>
                <h4 className="text-md font-semibold text-brown-primary bg-brown-accent/10 px-3 py-2 rounded-lg">{product.name}</h4>
                {(productLegals[product.id] || []).map((legal, index) => (
                  <motion.div
                    key={index}
                    className="relative border border-brown-bg/40 rounded-lg p-4 space-y-3 bg-white/50 backdrop-blur-sm shadow-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.4 + productIndex * 0.1 + index * 0.1 }}
                    whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(96, 42, 29, 0.1)" }}>
                    {/* Cancel button for all legals */}
                    <motion.button
                      type="button"
                      onClick={() => removeProductLegal(product.id, index)}
                      className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}>
                      <X size={16} />
                    </motion.button>

                    <label className="block text-sm font-medium text-brown-primary">Legal Type</label>
                    <input
                      type="text"
                      className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                      value={legal.legalType}
                      onChange={(e) => updateProductLegal(product.id, index, "legalType", e.target.value)}
                    />

                    <motion.div
                      className="border-2 border-dashed border-brown-bg/30 rounded-lg p-3 bg-brown-bg-light/30 backdrop-blur-sm hover:border-brown-accent/50 transition-all duration-300"
                      whileHover={{ scale: 1.01 }}>
                      <label className="text-sm font-medium text-brown-primary mb-2 flex items-center">
                        <Upload className="w-4 h-4 mr-1" />
                        Upload PDF
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="w-full text-brown-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brown-accent file:text-white hover:file:bg-brown-accent/90 file:transition-all file:duration-200"
                        onChange={(e) => updateProductLegal(product.id, index, "file", e.target.files?.[0] || null)}
                      />
                    </motion.div>

                    <label className="block text-sm font-medium text-brown-primary">Issued By</label>
                    <input
                      type="text"
                      className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                      value={legal.issuedBy}
                      onChange={(e) => updateProductLegal(product.id, index, "issuedBy", e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brown-primary">Issued At</label>
                        <input
                          type="date"
                          className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                          value={legal.issuedAt || ""}
                          onChange={(e) => updateProductLegal(product.id, index, "issuedAt", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brown-primary">Valid Until</label>
                        <input
                          type="date"
                          className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                          value={legal.validUntil || ""}
                          onChange={(e) => updateProductLegal(product.id, index, "validUntil", e.target.value)}
                        />
                      </div>
                    </div>

                    <label className="block text-sm font-medium text-brown-primary">Notes</label>
                    <textarea
                      className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text resize-none"
                      rows={2}
                      value={legal.notes}
                      onChange={(e) => updateProductLegal(product.id, index, "notes", e.target.value)}
                      placeholder="Additional notes or comments..."
                    />
                  </motion.div>
                ))}
                <motion.button
                  type="button"
                  onClick={() => addProductLegal(product.id)}
                  className="text-brown-primary hover:text-brown-accent text-sm font-medium flex items-center transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <Sparkles className="w-4 h-4 mr-1" />+ Add More Legal for {product.name}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div className="flex justify-between items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.8 }}>
            <motion.button
              type="button"
              onClick={() => navigate("/business/suggestions")}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              View AI Suggestions
            </motion.button>

            <motion.button
              type="submit"
              className="bg-gradient-to-r from-brown-primary to-brown-accent hover:from-brown-primary/90 hover:to-brown-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Save & Continue to Step 3
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default Step2Page;
