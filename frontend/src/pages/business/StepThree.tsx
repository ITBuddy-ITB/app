import React, { useState } from "react";
import { motion } from "framer-motion";
import StepIndicator from "../../components/StepIndicator";
import { X, DollarSign, TrendingUp, BarChart3, Upload, Plus, Sparkles } from "lucide-react";
// import { useNavigate } from "react-router";

interface Financial {
  ebitda?: number;
  assets?: number;
  liabilities?: number;
  equity?: number;
  reportFile?: File | null;
  notes?: string;
}

interface CustomField {
  name: string;
  value: string;
}

const Step3Page: React.FC = () => {
  //   const navigate = useNavigate();

  const [financial, setFinancial] = useState<Financial>({
    ebitda: undefined,
    assets: undefined,
    liabilities: undefined,
    equity: undefined,
    reportFile: null,
    notes: "",
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const updateField = (field: keyof Financial, value: unknown) => {
    setFinancial((prev) => ({ ...prev, [field]: value }));
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  const updateCustomField = (index: number, field: keyof CustomField, value: string) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], [field]: value };
    setCustomFields(updated);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      financial,
      customFields,
    };

    console.log("Step 3 Payload:", payload);

    // TODO: send to backend
    // navigate("/business/step-4");
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
            <BarChart3 className="w-8 h-8 text-brown-accent" />
          </motion.div>
          <h2 className="text-3xl font-bold text-brown-primary mb-2 drop-shadow-sm">Step 3: Financial Report</h2>
          <p className="text-brown-text/70">Provide financial information to showcase your business performance</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          {/* Financial Fields */}
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
                <DollarSign className="w-5 h-5 mr-2 text-brown-accent" />
              </motion.div>
              Financial Overview
            </motion.h3>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.0 }}>
                <label className="text-sm font-medium text-brown-primary mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  EBITDA
                </label>
                <input
                  type="number"
                  className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                  value={financial.ebitda || ""}
                  onChange={(e) => updateField("ebitda", parseFloat(e.target.value))}
                  placeholder="Enter EBITDA value"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.1 }}>
                <label className="text-sm font-medium text-brown-primary mb-2 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Assets
                </label>
                <input
                  type="number"
                  className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                  value={financial.assets || ""}
                  onChange={(e) => updateField("assets", parseFloat(e.target.value))}
                  placeholder="Enter total assets"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.2 }}>
                <label className="text-sm font-medium text-brown-primary mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                  Liabilities
                </label>
                <input
                  type="number"
                  className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                  value={financial.liabilities || ""}
                  onChange={(e) => updateField("liabilities", parseFloat(e.target.value))}
                  placeholder="Enter total liabilities"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.3 }}>
                <label className="text-sm font-medium text-brown-primary mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Equity
                </label>
                <input
                  type="number"
                  className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                  value={financial.equity || ""}
                  onChange={(e) => updateField("equity", parseFloat(e.target.value))}
                  placeholder="Enter equity value"
                />
              </motion.div>
            </div>

            {/* Report File Upload */}
            <motion.div
              className="border-2 border-dashed border-brown-bg/30 rounded-lg p-4 bg-brown-bg-light/30 backdrop-blur-sm hover:border-brown-accent/50 transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              whileHover={{ scale: 1.01 }}>
              <label className="text-sm font-medium text-brown-primary mb-2 flex items-center">
                <Upload className="w-4 h-4 mr-1" />
                Upload Raw Financial Report (PDF/TXT)
              </label>
              <input
                type="file"
                accept=".pdf,.txt"
                className="w-full text-brown-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brown-accent file:text-white hover:file:bg-brown-accent/90 file:transition-all file:duration-200"
                onChange={(e) => updateField("reportFile", e.target.files?.[0] || null)}
              />
              {financial.reportFile && (
                <motion.p
                  className="text-sm text-brown-text/70 mt-2 bg-brown-accent/10 p-2 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}>
                  Selected: {financial.reportFile.name}
                </motion.p>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.5 }}>
              <label className="block text-sm font-medium text-brown-primary mb-2">Notes</label>
              <textarea
                className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text resize-none"
                rows={3}
                value={financial.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Additional notes about your financial information..."
              />
            </motion.div>
          </motion.div>

          {/* Custom Key-Value */}
          <motion.div
            className="relative bg-brown-bg-light/80 backdrop-blur-sm shadow-xl rounded-xl p-6 space-y-4 border border-brown-bg/30 overflow-hidden"
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
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 5,
                }}>
                <Sparkles className="w-5 h-5 mr-2 text-brown-accent" />
              </motion.div>
              Additional Info (Optional)
            </motion.h3>

            {customFields.map((field, index) => (
              <motion.div
                key={index}
                className="flex gap-2 items-center bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-brown-bg/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}>
                <input
                  type="text"
                  placeholder="Key (e.g., Revenue Stream)"
                  className="flex-1 border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text text-sm"
                  value={field.name}
                  onChange={(e) => updateCustomField(index, "name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value (e.g., Subscription, E-commerce)"
                  className="flex-1 border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text text-sm"
                  value={field.value}
                  onChange={(e) => updateCustomField(index, "value", e.target.value)}
                />
                <motion.button
                  type="button"
                  onClick={() => removeCustomField(index)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}>
                  <X className="text-red-600" size={16} />
                </motion.button>
              </motion.div>
            ))}

            <motion.button
              type="button"
              onClick={addCustomField}
              className="text-brown-primary hover:text-brown-accent text-sm font-medium flex items-center transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Plus className="w-4 h-4 mr-1" />+ Add Additional Info
            </motion.button>
          </motion.div>

          {/* Actions */}
          <motion.div className="flex justify-end" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.6 }}>
            <motion.button
              type="submit"
              className="bg-gradient-to-r from-brown-primary to-brown-accent hover:from-brown-primary/90 hover:to-brown-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Save & Continue to Step 4
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default Step3Page;
