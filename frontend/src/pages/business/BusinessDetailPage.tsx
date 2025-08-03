import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Navbar from "../../components/Navbar";
import { BusinessService, type Business } from "../../services/businessService";

const BusinessDetailPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        setError(null);
        const business = await BusinessService.getBusinessById(parseInt(businessId!));
        setBusiness(business);
      } catch (err: unknown) {
        console.error("Failed to load business:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load business details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Navbar />
        <div className="max-w-6xl mx-auto py-12 px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Navbar />
        <div className="max-w-6xl mx-auto py-12 px-4">
          <div className="text-center text-red-600">{error || "Business not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Business Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
              <p className="text-gray-600 mb-4">{business.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>
                  <strong>Type:</strong> {business.type}
                </span>
                <span>
                  <strong>Industry:</strong> {business.industry}
                </span>
                {business.market_cap && (
                  <span>
                    <strong>Market Cap:</strong> ${business.market_cap.toLocaleString()}
                  </span>
                )}
                {business.founded_at && (
                  <span>
                    <strong>Founded:</strong> {new Date(business.founded_at).getFullYear()}
                  </span>
                )}
              </div>
            </div>
            <Link to="/business" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
              Back to Businesses
            </Link>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Products */}
          <Link to={`/business/${businessId}/products`} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Products</h3>
              <p className="text-gray-600 text-sm">Manage business products</p>
            </div>
          </Link>

          {/* Legal Documents */}
          <Link to={`/business/${businessId}/legal`} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2v0a2 2 0 012 2v10a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Documents</h3>
              <p className="text-gray-600 text-sm">Upload legal certificates</p>
            </div>
          </Link>

          {/* Financial Data */}
          <Link to={`/business/${businessId}/finance`} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Data</h3>
              <p className="text-gray-600 text-sm">Add financial information</p>
            </div>
          </Link>

          {/* Investment Projections */}
          <Link to={`/business/${businessId}/projections`} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Projections</h3>
              <p className="text-gray-600 text-sm">Investment projections</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
