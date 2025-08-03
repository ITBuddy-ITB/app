import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Navbar from "../../components/Navbar";
import { BusinessService, type Financial } from "../../services/businessService";

const FinancialPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [financial, setFinancial] = useState<Financial | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    ebitda: "",
    assets: "",
    liabilities: "",
    equity: "",
    notes: "",
  });

  useEffect(() => {
    const fetchFinancial = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await BusinessService.getBusinessFinancial(parseInt(businessId!));
        setFinancial(data);

        // Populate form with existing data
        setFormData({
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
  }, [businessId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const updateData: Partial<Financial> = {
        ebitda: formData.ebitda ? parseFloat(formData.ebitda) : undefined,
        assets: formData.assets ? parseFloat(formData.assets) : undefined,
        liabilities: formData.liabilities ? parseFloat(formData.liabilities) : undefined,
        equity: formData.equity ? parseFloat(formData.equity) : undefined,
        notes: formData.notes || undefined,
      };

      const updatedFinancial = await BusinessService.updateBusinessFinancial(parseInt(businessId!), updateData);
      setFinancial(updatedFinancial);
      setSuccessMessage("Financial data updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      console.error("Failed to update financial data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update financial data";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center">Loading financial data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Data</h1>
            <p className="text-gray-600">Manage your business financial information</p>
          </div>
          <Link to={`/business/${businessId}/details`} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
            Back to Business
          </Link>
        </div>

        {/* Success Message */}
        {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{successMessage}</div>}

        {/* Error Message */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Financial Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EBITDA */}
              <div>
                <label htmlFor="ebitda" className="block text-sm font-medium text-gray-700 mb-2">
                  EBITDA ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="ebitda"
                  name="ebitda"
                  value={formData.ebitda}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter EBITDA amount"
                />
              </div>

              {/* Assets */}
              <div>
                <label htmlFor="assets" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Assets ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="assets"
                  name="assets"
                  value={formData.assets}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter total assets"
                />
              </div>

              {/* Liabilities */}
              <div>
                <label htmlFor="liabilities" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Liabilities ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="liabilities"
                  name="liabilities"
                  value={formData.liabilities}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter total liabilities"
                />
              </div>

              {/* Equity */}
              <div>
                <label htmlFor="equity" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Equity ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="equity"
                  name="equity"
                  value={formData.equity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter total equity"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter any additional financial notes or details..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                {saving ? "Saving..." : "Save Financial Data"}
              </button>
            </div>
          </form>
        </div>

        {/* Financial Summary */}
        {financial && (financial.ebitda || financial.assets || financial.liabilities || financial.equity) && (
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {financial.ebitda && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">${financial.ebitda.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">EBITDA</div>
                </div>
              )}
              {financial.assets && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">${financial.assets.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Assets</div>
                </div>
              )}
              {financial.liabilities && (
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">${financial.liabilities.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Liabilities</div>
                </div>
              )}
              {financial.equity && financial.liabilities && financial.assets && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{((financial.equity / financial.assets) * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Equity Ratio</div>
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
