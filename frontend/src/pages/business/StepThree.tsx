import React, { useState } from "react";
import StepIndicator from "../../components/StepIndicator";
import { X } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <StepIndicator />

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Langkah 3: Laporan Keuangan</h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Financial Fields */}
          <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Ringkasan Keuangan</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">EBITDA</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-4 py-2"
                  value={financial.ebitda || ""}
                  onChange={(e) => updateField("ebitda", parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Aset</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-4 py-2"
                  value={financial.assets || ""}
                  onChange={(e) => updateField("assets", parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kewajiban</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-4 py-2"
                  value={financial.liabilities || ""}
                  onChange={(e) => updateField("liabilities", parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ekuitas</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-4 py-2"
                  value={financial.equity || ""}
                  onChange={(e) => updateField("equity", parseFloat(e.target.value))}
                />
              </div>
            </div>

            {/* Report File Upload */}
            <div className="border border-dashed border-gray-300 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700">
                Unggah Laporan Keuangan Mentah (PDF/TXT)
              </label>
              <input
                type="file"
                accept=".pdf,.txt"
                className="w-full"
                onChange={(e) => updateField("reportFile", e.target.files?.[0] || null)}
              />
              {financial.reportFile && (
                <p className="text-sm text-gray-500 mt-1">Dipilih: {financial.reportFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Catatan</label>
              <textarea
                className="w-full border rounded-lg px-4 py-2"
                rows={3}
                value={financial.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </div>
          </div>

          {/* Custom Key-Value */}
          <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Info Tambahan (Opsional)</h3>
            {customFields.map((field, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Kunci"
                  className="flex-1 border rounded-lg px-4 py-2"
                  value={field.name}
                  onChange={(e) => updateCustomField(index, "name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Nilai"
                  className="flex-1 border rounded-lg px-4 py-2"
                  value={field.value}
                  onChange={(e) => updateCustomField(index, "value", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeCustomField(index)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                >
                  <X className="text-red-600" size={16} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addCustomField} className="text-blue-600 hover:underline text-sm">
              + Tambah Info Tambahan
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Simpan & Lanjutkan ke Langkah 4
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step3Page;
