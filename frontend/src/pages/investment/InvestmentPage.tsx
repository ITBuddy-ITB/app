import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Building2,
  Star,
  ArrowUpRight,
  Users,
  Target,
  FileText,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useInvestment } from "../../hooks/useInvestment";
import type { Business } from "../../services/businessService";
import BusinessDetailsModal from "./BusinessDetailsModal";
import BusinessCard from "./BusinessCard";

const InvestmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { businesses, loading, error, pagination, fetchBusinesses, searchBusinesses, changePage, changeLimit } =
    useInvestment();

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  // Get unique industries for filter
  const industries = Array.from(new Set(businesses.map((business) => business.industry).filter(Boolean)));

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBusinesses(searchTerm, {
      industry: selectedIndustry || undefined,
      limit: pagination.limit,
    });
  };

  const handleViewDetails = (business: Business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  };

  const handlePageChange = (newPage: number) => {
    changePage(newPage, {
      search: searchTerm || undefined,
      industry: selectedIndustry || undefined,
      limit: pagination.limit,
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Private <span className="text-blue-600">Investment</span> Opportunities
          </h1>
          <button
            onClick={() => navigate("/investments/portfolio")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center"
          >
            <Briefcase className="w-5 h-5 mr-2" />
            My Portfolio
          </button>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Invest in promising Indonesian businesses with complete financial and legal documentation. Support growth
          while earning attractive returns.
        </p>
      </div>

      {/* Investment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                Available to invest
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With Financial Data</p>
              <p className="text-2xl font-bold text-gray-900">{businesses.filter((b) => b.financial).length}</p>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Ready for analysis
              </p>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With Legal Docs</p>
              <p className="text-2xl font-bold text-gray-900">
                {businesses.filter((b) => b.legals && b.legals.length > 0).length}
              </p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <Star className="w-3 h-3 mr-1" />
                Legally compliant
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Industries</p>
              <p className="text-2xl font-bold text-gray-900">{industries.length}</p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <Users className="w-3 h-3 mr-1" />
                Diverse sectors
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Businesses
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                id="industry"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {businesses.length} of {pagination.total} businesses
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm text-gray-600">
            Show:
          </label>
          <select
            id="limit"
            value={pagination.limit}
            onChange={(e) =>
              changeLimit(Number(e.target.value), {
                search: searchTerm || undefined,
                industry: selectedIndustry || undefined,
              })
            }
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Business Grid */}
      {!loading && !error && (
        <>
          <div className="space-y-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Investment Opportunities</h2>
            {businesses.map((business) => (
              <BusinessCard key={business.ID} business={business} onViewDetails={handleViewDetails} />
            ))}
          </div>

          {/* Empty State */}
          {businesses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No businesses found</p>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => page === 1 || page === pagination.totalPages || Math.abs(page - pagination.page) <= 2)
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 py-2 text-sm text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm border rounded-md ${
                        page === pagination.page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Business Details Modal */}
      <BusinessDetailsModal business={selectedBusiness} isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default InvestmentPage;
