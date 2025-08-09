import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { BusinessService, type Business } from "../../services/businessService";
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  DollarSign,
  Scale,
  Package,
  Calendar,
  Target,
  Award,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
} from "lucide-react";
import AISuggestions from "../../components/business/AISuggestions";

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

  // Calculate investment readiness score
  const calculateInvestmentReadiness = (business: Business) => {
    let score = 0;
    if (business.financial) score += 30;
    if (business.legals && business.legals.length > 0) score += 25;
    if (business.products && business.products.length > 0) score += 20;
    if (business.description) score += 15;
    if (business.market_cap && business.market_cap > 10000000000) score += 10;
    return score;
  };

  const getBusinessStage = (score: number) => {
    if (score >= 80)
      return {
        stage: "Investment Ready",
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        border: "border-emerald-200",
      };
    if (score >= 60) return { stage: "Growth", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" };
    if (score >= 40)
      return { stage: "Scale-up", color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-200" };
    return { stage: "UMKM", color: "text-red-600", bg: "bg-red-100", border: "border-red-200" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-lg text-gray-600">Loading business details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="text-center py-20">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-lg text-gray-600 mb-6">{error || "Business not found"}</p>
            <Link
              to="/business"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Businesses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const investmentScore = calculateInvestmentReadiness(business);
  const stage = getBusinessStage(investmentScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header with Back Button */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Link
              to="/business"
              className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="font-medium">Back to Business Portfolio</span>
            </Link>
            {/* Create New Business Button */}
            <Link
              to="/business/step-1"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Create New Business</span>
            </Link>
          </div>
        </div>

        {/* Business Hero Section */}
        <div className="relative bg-gradient-to-r from-emerald-700 via-emerald-600 to-blue-600 rounded-2xl p-6 mb-6 text-white overflow-hidden shadow-xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                backgroundSize: "24px 24px",
                opacity: 0.1,
              }}
            ></div>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">{business.name}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${stage.bg} ${stage.color} border ${stage.border} shadow-lg`}
                >
                  {stage.stage}
                </span>
              </div>

              {business.description && (
                <p className="text-white/90 text-sm mb-4 leading-relaxed max-w-2xl drop-shadow-md">
                  {business.description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {business.type && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/20 shadow-lg">
                    <div className="flex items-center mb-1">
                      <Target className="w-3 h-3 mr-1 text-white" />
                      <span className="font-medium text-white">Type</span>
                    </div>
                    <span className="text-white/90 font-medium text-xs">{business.type}</span>
                  </div>
                )}
                {business.industry && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/20 shadow-lg">
                    <div className="flex items-center mb-1">
                      <Building2 className="w-3 h-3 mr-1 text-white" />
                      <span className="font-medium text-white">Industry</span>
                    </div>
                    <span className="text-white/90 font-medium text-xs">{business.industry}</span>
                  </div>
                )}
                {business.market_cap && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/20 shadow-lg">
                    <div className="flex items-center mb-1">
                      <DollarSign className="w-3 h-3 mr-1 text-white" />
                      <span className="font-medium text-white">Market Cap</span>
                    </div>
                    <span className="text-white/90 font-medium text-xs">
                      IDR {(business.market_cap / 1000000000).toFixed(1)}B
                    </span>
                    <span className="text-white/90 font-medium text-xs">
                      IDR {(business.market_cap / 1000000000).toFixed(1)}B
                    </span>
                  </div>
                )}
                {business.founded_at && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/20 shadow-lg">
                    <div className="flex items-center mb-1">
                      <Calendar className="w-3 h-3 mr-1 text-white" />
                      <span className="font-medium text-white">Founded</span>
                    </div>
                    <span className="text-white/90 font-medium text-xs">
                      {new Date(business.founded_at).getFullYear()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Investment Readiness Score */}
            <div className="lg:col-span-1">
              <div className="bg-white/25 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30 shadow-xl">
                <div className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{investmentScore}%</div>
                <div className="text-white font-semibold text-sm mb-3 drop-shadow-md">Investment Ready</div>
                <div className="w-full bg-white/30 rounded-full h-2 mb-3 shadow-inner">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${investmentScore}%` }}
                  ></div>
                </div>
                <p className="text-white/90 text-xs font-medium drop-shadow-sm">
                  {investmentScore >= 80
                    ? "Ready for investment!"
                    : investmentScore >= 60
                    ? "Almost ready!"
                    : "Keep building!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Products Management */}
          <Link
            to={`/business/${businessId}/products`}
            className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-blue-100/30 transition-all duration-300"></div>
            <div className="relative text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                Products
              </h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-sm">Manage your business products and services</p>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <span className="flex items-center">
                  {business.products && business.products.length > 0 ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                      {business.products.length} products
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      No products yet
                    </>
                  )}
                </span>
              </div>
            </div>
          </Link>

          {/* Legal Documents */}
          <Link
            to={`/business/${businessId}/legal`}
            className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-emerald-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/0 group-hover:from-emerald-50/50 group-hover:to-emerald-100/30 transition-all duration-300"></div>
            <div className="relative text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Scale className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Legal Documents
              </h3>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Legal Documents
              </h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-sm">Upload and manage legal certificates</p>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <span className="flex items-center">
                  {business.legals && business.legals.length > 0 ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                      {business.legals.length} documents
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      No documents yet
                    </>
                  )}
                </span>
              </div>
            </div>
          </Link>

          {/* Financial Data */}
          <Link
            to={`/business/${businessId}/finance`}
            className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-yellow-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/0 to-yellow-50/0 group-hover:from-yellow-50/50 group-hover:to-yellow-100/30 transition-all duration-300"></div>
            <div className="relative text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors">
                Financial Data
              </h3>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors">
                Financial Data
              </h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-sm">Add financial information and statements</p>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <span className="flex items-center">
                  {business.financial ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                      Complete
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      Pending
                    </>
                  )}
                </span>
              </div>
            </div>
          </Link>

          {/* Investment Projections */}
          <Link
            to={`/business/${businessId}/projections`}
            className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-purple-50/0 group-hover:from-purple-50/50 group-hover:to-purple-100/30 transition-all duration-300"></div>
            <div className="relative text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                Projections
              </h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-sm">Financial projections and growth forecasts</p>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                  View projections
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* AI Suggestions */}
        <div className="pb-8">
        <AISuggestions businessId={business.ID} businessName={business.name} />
        </div>

        {/* Investment Readiness Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-emerald-600" />
            Investment Readiness Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  business.financial ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                <DollarSign className={`w-6 h-6 ${business.financial ? "text-emerald-600" : "text-gray-400"}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Financial Data</h3>
              <p className="text-xs text-gray-600 mb-2">30% of total score</p>
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  business.financial ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                }`}
              >
                {business.financial ? "Complete" : "Missing"}
              </div>
            </div>

            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  business.legals && business.legals.length > 0 ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                <Scale
                  className={`w-6 h-6 ${
                    business.legals && business.legals.length > 0 ? "text-emerald-600" : "text-gray-400"
                  }`}
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Legal Documents</h3>
              <p className="text-xs text-gray-600 mb-2">25% of total score</p>
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  business.legals && business.legals.length > 0
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {business.legals && business.legals.length > 0 ? `${business.legals.length} docs` : "Missing"}
              </div>
            </div>

            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  business.products && business.products.length > 0 ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                <Package
                  className={`w-6 h-6 ${
                    business.products && business.products.length > 0 ? "text-emerald-600" : "text-gray-400"
                  }`}
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Products</h3>
              <p className="text-xs text-gray-600 mb-2">20% of total score</p>
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  business.products && business.products.length > 0
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {business.products && business.products.length > 0 ? `${business.products.length} products` : "Missing"}
              </div>
            </div>

            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  business.market_cap && business.market_cap > 10000000000 ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                <TrendingUp
                  className={`w-6 h-6 ${
                    business.market_cap && business.market_cap > 10000000000 ? "text-emerald-600" : "text-gray-400"
                  }`}
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Market Cap</h3>
              <p className="text-xs text-gray-600 mb-2">15% + 10% bonus</p>
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  business.market_cap && business.market_cap > 10000000000
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {business.market_cap && business.market_cap > 10000000000 ? "Qualified" : "Below threshold"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
