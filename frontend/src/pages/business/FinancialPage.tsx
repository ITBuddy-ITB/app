import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { BusinessService, type Financial } from "../../services/businessService";

interface FinancialFormData {
  revenue: string;
  ebitda: string;
  assets: string;
  liabilities: string;
  equity: string;
  notes: string;
}

const FinancialPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [financial, setFinancial] = useState<Financial | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FinancialFormData>({
    defaultValues: {
      revenue: "",
      ebitda: "",
      assets: "",
      liabilities: "",
      equity: "",
      notes: "",
    },
  });

  useEffect(() => {
    const fetchFinancial = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await BusinessService.getBusinessFinancial(parseInt(businessId!));
        setFinancial(data);

        // Populate form with existing data using React Hook Form reset
        reset({
          revenue: data.revenue?.toString() || "",
          ebitda: data.ebitda?.toString() || "",
          assets: data.assets?.toString() || "",
          liabilities: data.liabilities?.toString() || "",
          equity: data.equity?.toString() || "",
          notes: data.notes || "",
        });
      } catch (err: unknown) {
        console.error("Failed to load financial data:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load financial data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchFinancial();
    }
  }, [businessId, reset]);

  const onSubmit = async (data: FinancialFormData) => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const newFinancialData: Partial<Financial> = {
        revenue: data.revenue ? parseFloat(data.revenue) : undefined,
        ebitda: data.ebitda ? parseFloat(data.ebitda) : undefined,
        assets: data.assets ? parseFloat(data.assets) : undefined,
        liabilities: data.liabilities ? parseFloat(data.liabilities) : undefined,
        equity: data.equity ? parseFloat(data.equity) : undefined,
        notes: data.notes || undefined,
      };

      // Create new financial record instead of updating
      const createdFinancial = await BusinessService.createBusinessFinancial(parseInt(businessId!), newFinancialData);
      setFinancial(createdFinancial);
      setSuccessMessage("Catatan keuangan baru berhasil dibuat!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error("Failed to create financial data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create financial data";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brown-bg">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center text-brown-primary">Memuat data keuangan...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown-bg">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brown-primary mb-2">Tambah Catatan Keuangan</h1>
            <p className="text-brown-text/70">Buat catatan keuangan baru untuk bisnis Anda</p>
          </div>
          <Link to={`/business/${businessId}/details`} className="bg-brown-bg-light hover:bg-brown-accent/20 text-brown-primary px-4 py-2 rounded-lg transition-colors">
            Back to Business
          </Link>
        </div>

        {/* Success Message */}
        {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{successMessage}</div>}

        {/* Error Message */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Financial Form */}
        <div className="bg-brown-bg-light shadow-lg rounded-xl p-6 border border-brown-primary/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue */}
              <div>
                <label htmlFor="revenue" className="block text-sm font-medium text-brown-primary mb-2">
                  Pendapatan (Rp)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="revenue"
                  {...register("revenue", {
                    required: "Revenue is required",
                    min: { value: 0, message: "Revenue must be positive" },
                  })}
                  className="w-full px-3 py-2 border-2 border-brown-bg/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent/20 focus:border-brown-accent transition-all duration-200 text-brown-text bg-white/80"
                  placeholder="Enter revenue amount"
                />
                {errors.revenue && <p className="text-red-500 text-sm mt-1">{errors.revenue.message}</p>}
              </div>

              {/* EBITDA */}
              <div>
                <label htmlFor="ebitda" className="block text-sm font-medium text-brown-primary mb-2">
                  EBITDA (Rp)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="ebitda"
                  {...register("ebitda", {
                    required: "EBITDA is required",
                    min: { value: 0, message: "EBITDA must be positive" },
                  })}
                  className="w-full px-3 py-2 border-2 border-brown-bg/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent/20 focus:border-brown-accent transition-all duration-200 text-brown-text bg-white/80"
                  placeholder="Enter EBITDA amount"
                />
                {errors.ebitda && <p className="text-red-500 text-sm mt-1">{errors.ebitda.message}</p>}
              </div>

              {/* Assets */}
              <div>
                <label htmlFor="assets" className="block text-sm font-medium text-brown-primary mb-2">
                  Total Aset (Rp)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="assets"
                  {...register("assets", {
                    required: "Total assets is required",
                    min: { value: 0, message: "Assets must be positive" },
                  })}
                  className="w-full px-3 py-2 border-2 border-brown-bg/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent/20 focus:border-brown-accent transition-all duration-200 text-brown-text bg-white/80"
                  placeholder="Enter total assets"
                />
                {errors.assets && <p className="text-red-500 text-sm mt-1">{errors.assets.message}</p>}
              </div>

              {/* Liabilities */}
              <div>
                <label htmlFor="liabilities" className="block text-sm font-medium text-brown-primary mb-2">
                  Total Kewajiban (Rp)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="liabilities"
                  {...register("liabilities", {
                    required: "Total liabilities is required",
                    min: { value: 0, message: "Liabilities must be positive" },
                  })}
                  className="w-full px-3 py-2 border-2 border-brown-bg/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent/20 focus:border-brown-accent transition-all duration-200 text-brown-text bg-white/80"
                  placeholder="Enter total liabilities"
                />
                {errors.liabilities && <p className="text-red-500 text-sm mt-1">{errors.liabilities.message}</p>}
              </div>

              {/* Equity */}
              <div>
                <label htmlFor="equity" className="block text-sm font-medium text-brown-primary mb-2">
                  Total Ekuitas (Rp)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="equity"
                  {...register("equity", {
                    required: "Total equity is required",
                  })}
                  className="w-full px-3 py-2 border-2 border-brown-bg/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent/20 focus:border-brown-accent transition-all duration-200 text-brown-text bg-white/80"
                  placeholder="Enter total equity"
                />
                {errors.equity && <p className="text-red-500 text-sm mt-1">{errors.equity.message}</p>}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-brown-primary mb-2">
                Catatan Tambahan
              </label>
              <textarea
                id="notes"
                rows={4}
                {...register("notes")}
                className="w-full px-3 py-2 border-2 border-brown-bg/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-accent/20 focus:border-brown-accent transition-all duration-200 text-brown-text bg-white/80"
                placeholder="Enter any additional financial notes or details..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="bg-brown-primary hover:bg-brown-primary-hover disabled:bg-brown-accent text-white font-medium py-2 px-6 rounded-lg transition-colors">
                {saving ? "Saving..." : "Save Financial Data"}
              </button>
            </div>
          </form>
        </div>

        {/* Financial Summary */}
        {financial && (financial.ebitda || financial.assets || financial.liabilities || financial.equity) && (
          <div className="bg-brown-bg-light shadow-lg rounded-xl p-6 mt-6 border border-brown-primary/20">
            <h2 className="text-xl font-semibold text-brown-primary mb-4">Ringkasan Keuangan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {financial.ebitda && (
                <div className="text-center p-4 bg-brown-bg-light rounded-lg">
                  <div className="text-2xl font-bold text-brown-primary">Rp{financial.ebitda.toLocaleString()}</div>
                  <div className="text-sm text-brown-text/60">EBITDA</div>
                </div>
              )}
              {financial.assets && (
                <div className="text-center p-4 bg-brown-bg rounded-lg">
                  <div className="text-2xl font-bold text-brown-primary">Rp{financial.assets.toLocaleString()}</div>
                  <div className="text-sm text-brown-text/60">Total Assets</div>
                </div>
              )}
              {financial.liabilities && (
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">Rp{financial.liabilities.toLocaleString()}</div>
                  <div className="text-sm text-brown-text/60">Total Kewajiban</div>
                </div>
              )}
              {financial.equity && financial.liabilities && financial.assets && (
                <div className="text-center p-4 bg-brown-accent-light rounded-lg">
                  <div className="text-2xl font-bold text-brown-accent">{((financial.equity / financial.assets) * 100).toFixed(1)}%</div>
                  <div className="text-sm text-brown-text/60">Equity Ratio</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialPage;
