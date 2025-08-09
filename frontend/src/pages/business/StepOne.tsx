import React from "react";
import { useBusiness } from "../../hooks/useBusiness";
import { useNavigate } from "react-router";

const Step1Page: React.FC = () => {
  const navigate = useNavigate();
  const { business, setBusiness, submitBusiness, loading, error } = useBusiness();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitBusiness();
    if (result) {
      // Redirect to business detail page
      navigate(`/business/${result.ID}/details`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Business</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Submit */}
          <div className="flex justify-between items-center">
            {error && <span className="text-red-600">{error}</span>}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Business"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step1Page;
