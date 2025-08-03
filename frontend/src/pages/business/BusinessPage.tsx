import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";
import { BusinessService, type Business } from "../../services/businessService";

const BusinessPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const businesses = await BusinessService.getUserBusinesses();
        setBusinesses(businesses);
      } catch (err: unknown) {
        console.error("Failed to load businesses:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load businesses";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Business</h2>
        <p className="text-gray-600 mb-8">Manage your businesses step by step. Create a new business or manage existing ones.</p>

        <div className="space-y-6">
          <Link to="/business/step-1" className="w-full bg-white shadow rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New Business</h3>
                <p className="text-gray-600">Start a new business process</p>
              </div>
              <div className="text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </Link>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading your businesses...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses yet</h3>
              <p className="text-gray-600 mb-4">Create your first business to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Your Businesses</h3>
              {businesses.map((business) => (
                <Link key={business.ID} to={`/business/${business.ID}/details`} className="block bg-white shadow rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{business.name}</h4>
                      {business.description && <p className="text-gray-600 mb-3 line-clamp-2">{business.description}</p>}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {business.type && (
                          <span>
                            <strong>Type:</strong> {business.type}
                          </span>
                        )}
                        {business.industry && (
                          <span>
                            <strong>Industry:</strong> {business.industry}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-blue-600 ml-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
