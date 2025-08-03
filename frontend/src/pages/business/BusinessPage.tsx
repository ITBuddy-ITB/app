import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";
import { BusinessService, type Business } from "../../services/businessService";
import { Building2, TrendingUp, Target, Trophy, Plus, CheckCircle, AlertCircle } from "lucide-react";

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

  // Mock function to calculate investment readiness score
  const calculateInvestmentReadiness = (business: Business) => {
    let score = 0;
    if (business.financial) score += 30;
    if (business.legals && business.legals.length > 0) score += 25;
    if (business.products && business.products.length > 0) score += 20;
    if (business.description) score += 15;
    if (business.market_cap && business.market_cap > 10000000000) score += 10; // 10B IDR minimum for private investment
    return score;
  };

  const getBusinessStage = (score: number) => {
    if (score >= 80) return { stage: "Investment Ready", color: "text-emerald-600", bg: "bg-emerald-100" };
    if (score >= 60) return { stage: "Growth", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 40) return { stage: "Scale-up", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { stage: "UMKM", color: "text-red-600", bg: "bg-red-100" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 rounded-full mb-6">
            <Trophy className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">UMKM Growth Platform</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Growth</span> Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Transform your UMKM into an investment-ready business. Track your progress through financial compliance, legal requirements, and growth milestones with our comprehensive platform.
          </p>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-2xl font-bold text-emerald-600 mb-1">{businesses.length}</div>
              <div className="text-sm text-gray-600">Active Businesses</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {businesses.length > 0 ? Math.round(businesses.reduce((acc, b) => acc + calculateInvestmentReadiness(b), 0) / businesses.length) : 0}%
              </div>
              <div className="text-sm text-gray-600">Avg. Investment Ready</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-2xl font-bold text-purple-600 mb-1">{businesses.filter((b) => calculateInvestmentReadiness(b) >= 80).length}</div>
              <div className="text-sm text-gray-600">Investment Ready</div>
            </div>
          </div>
        </div>

        {/* Create New Business Card */}
        <div className="mb-12">
          <Link
            to="/business/step-1"
            className="relative w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 text-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 block group overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                  backgroundSize: "24px 24px",
                }}></div>
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-3">Start New Business Journey</h2>
                  <p className="text-emerald-100 text-lg">Begin your transformation from UMKM to investment-ready business</p>
                  <div className="flex items-center mt-3 text-white/80">
                    <span className="text-sm">✨ AI-Powered Guidance</span>
                    <span className="mx-3">•</span>
                    <span className="text-sm">📊 Real-time Analytics</span>
                    <span className="mx-3">•</span>
                    <span className="text-sm">🎯 Investment Matching</span>
                  </div>
                </div>
              </div>
              <div className="opacity-60 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300">
                <Trophy className="w-16 h-16" />
              </div>
            </div>
          </Link>
        </div>

        {/* Business List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-gray-600">Loading your businesses...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-emerald-200 to-blue-200 rounded-full opacity-20"></div>
                </div>
                <div className="relative text-gray-400 mb-6">
                  <Building2 className="w-24 h-24 mx-auto" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">Create your first business profile and begin the transformation from UMKM to investment-ready enterprise.</p>
              <Link
                to="/business/step-1"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Plus className="w-5 h-5 mr-3" />
                <span className="font-semibold">Create Your First Business</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Your Business Portfolio
                </h3>
                <div className="text-sm text-gray-500">
                  {businesses.length} {businesses.length === 1 ? "business" : "businesses"}
                </div>
              </div>

              <div className="grid gap-8">
                {businesses.map((business) => {
                  const investmentScore = calculateInvestmentReadiness(business);
                  const stage = getBusinessStage(investmentScore);

                  return (
                    <Link
                      key={business.ID}
                      to={`/business/${business.ID}/details`}
                      className="relative group block bg-white rounded-3xl p-8 border border-gray-200 hover:border-emerald-300 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                      {/* Background Gradient on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-blue-50/0 group-hover:from-emerald-50/50 group-hover:to-blue-50/30 transition-all duration-500"></div>

                      <div className="relative">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <h4 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">{business.name}</h4>
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${stage.bg} ${stage.color} border shadow-sm`}>{stage.stage}</span>
                            </div>

                            {business.description && <p className="text-gray-600 mb-6 line-clamp-2 text-lg leading-relaxed">{business.description}</p>}

                            <div className="flex flex-wrap gap-8 text-sm text-gray-500 mb-6">
                              {business.type && (
                                <span className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                                  <Target className="w-4 h-4 mr-2 text-emerald-600" />
                                  <strong className="mr-2 text-gray-700">Type:</strong> {business.type}
                                </span>
                              )}
                              {business.industry && (
                                <span className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                                  <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                                  <strong className="mr-2 text-gray-700">Industry:</strong> {business.industry}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right ml-8">
                            <div className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white rounded-2xl p-6 text-center min-w-[120px]">
                              <div className="text-3xl font-bold mb-1">{investmentScore}%</div>
                              <div className="text-sm opacity-90">Investment Ready</div>
                            </div>
                            <div className="mt-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Progress Bar */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Investment Readiness</span>
                            <span className="text-sm text-gray-500">{investmentScore}% Complete</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${investmentScore}%` }}></div>
                          </div>
                        </div>

                        {/* Enhanced Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                          <div
                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
                              business.financial ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-500"
                            }`}>
                            <CheckCircle className={`w-5 h-5 mr-2 ${business.financial ? "text-emerald-600" : "text-gray-400"}`} />
                            <span className="font-medium text-sm">Financial {business.financial ? "Complete" : "Pending"}</span>
                          </div>
                          <div
                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
                              business.legals && business.legals.length > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-500"
                            }`}>
                            <CheckCircle className={`w-5 h-5 mr-2 ${business.legals && business.legals.length > 0 ? "text-emerald-600" : "text-gray-400"}`} />
                            <span className="font-medium text-sm">Legal {business.legals && business.legals.length > 0 ? "Complete" : "Pending"}</span>
                          </div>
                          <div
                            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
                              business.products && business.products.length > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-500"
                            }`}>
                            <CheckCircle className={`w-5 h-5 mr-2 ${business.products && business.products.length > 0 ? "text-emerald-600" : "text-gray-400"}`} />
                            <span className="font-medium text-sm">Products {business.products && business.products.length > 0 ? "Complete" : "Pending"}</span>
                          </div>
                        </div>
                      </div>
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
