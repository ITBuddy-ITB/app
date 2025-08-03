import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";
import { BusinessService, type Business } from "../../services/businessService";
import { Building2, TrendingUp, Target, Trophy, Plus, AlertCircle } from "lucide-react";

const BusinessPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const allBusinesses = await BusinessService.getUserBusinesses();
        setBusinesses(allBusinesses);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      <Navbar />

      <div className="max-w-6xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 rounded-full mb-4">
            <Trophy className="w-3 h-3 mr-2" />
            <span className="text-xs font-medium">Business Management Platform</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Business</span> Portfolio
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">Manage your complete business profiles with our comprehensive platform.</p>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-xl font-bold text-emerald-600 mb-1">{businesses.length}</div>
              <div className="text-xs text-gray-600">Active Businesses</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-xl font-bold text-blue-600 mb-1">{businesses.length}</div>
              <div className="text-xs text-gray-600">Ready for Listing</div>
            </div>
          </div>
        </div>

        {/* Business List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="mt-2 text-gray-600">Loading your businesses...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-200 to-blue-200 rounded-full opacity-20"></div>
                </div>
                <div className="relative text-gray-400 mb-4">
                  <Building2 className="w-16 h-16 mx-auto" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Businesses Ready Yet</h3>
              <p className="text-base text-gray-600 mb-6 max-w-lg mx-auto leading-relaxed">
                You don't have any complete business profiles yet. Create a new business and complete all the required steps to see it listed here.
              </p>
              <Link
                to="/business/step-1"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-semibold">Create New Business</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="h-6 w-6 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  Your Business Portfolio
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500">
                    {businesses.length} {businesses.length === 1 ? "business" : "businesses"}
                  </div>
                  {/* Create New Business Button - Moved here */}
                  <Link
                    to="/business/step-1"
                    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium">
                    <Plus className="w-4 h-4 mr-1" />
                    <span>New Business</span>
                  </Link>
                </div>
              </div>

              {/* Helper text */}
              <p className="text-xs text-gray-500 mb-3">Click on any business card to view details and manage your business information</p>

              <div className="grid gap-3">
                {businesses.map((business) => {
                  return (
                    <Link
                      key={business.ID}
                      to={`/business/${business.ID}/details`}
                      className="relative group block bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors duration-200 truncate">{business.name}</h4>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border flex-shrink-0">Active</span>
                          </div>

                          <div className="flex items-center space-x-4 mb-3">
                            {business.type && (
                              <span className="flex items-center text-xs text-gray-600">
                                <Target className="w-3 h-3 mr-1 text-emerald-600" />
                                {business.type}
                              </span>
                            )}
                            {business.industry && (
                              <span className="flex items-center text-xs text-gray-600">
                                <Building2 className="w-3 h-3 mr-1 text-blue-600" />
                                {business.industry}
                              </span>
                            )}
                          </div>

                          {business.description && <p className="text-xs text-gray-600 line-clamp-1">{business.description}</p>}
                        </div>

                        <div className="flex items-center space-x-3 ml-4">
                          {/* Status Indicators */}
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" title="Complete"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500" title="Verified"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500" title="Ready"></div>
                          </div>

                          {/* Click indicator */}
                          <div className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-blue-500/0 group-hover:from-emerald-500/5 group-hover:to-blue-500/5 transition-all duration-200 rounded-lg"></div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
