import React from "react";
import { FileText, BarChart3, Building2 } from "lucide-react";
import type { Business } from "../../services/businessService";

interface BusinessCardProps {
  business: Business;
  onViewDetails: (business: Business) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onViewDetails }) => {
  const formatCurrency = (amount?: number) => {
    if (!amount) return "Not specified";
    if (amount >= 1000000000) {
      return `IDR ${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `IDR ${(amount / 1000000).toFixed(0)}M`;
    }
    return `IDR ${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Company Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{business.name}</h3>
              <p className="text-gray-600 mb-4">{business.description || "No description available"}</p>
              <div className="flex items-center space-x-4">
                {business.industry && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {business.industry}
                  </span>
                )}
                {business.type && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {business.type}
                  </span>
                )}
              </div>
            </div>
            {business.market_cap && (
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-1">{formatCurrency(business.market_cap)}</div>
                <div className="text-sm text-gray-500">Market Cap</div>
              </div>
            )}
          </div>

          {/* Business Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Founded</p>
              <p className="font-semibold text-gray-900">
                {business.founded_at ? new Date(business.founded_at).getFullYear() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Legal Docs</p>
              <p className="font-semibold text-gray-900 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {business.legals?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Financial Data</p>
              <p className="font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                {business.financial ? "Available" : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Products</p>
              <p className="font-semibold text-gray-900">{business.products?.length || 0}</p>
            </div>
          </div>

          {/* Financial Highlights */}
          {business.financial && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Financial Highlights</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {business.financial.ebitda && (
                  <div>
                    <p className="text-gray-500">EBITDA</p>
                    <p className="font-semibold text-green-600">{formatCurrency(business.financial.ebitda)}</p>
                  </div>
                )}
                {business.financial.assets && (
                  <div>
                    <p className="text-gray-500">Assets</p>
                    <p className="font-semibold text-blue-600">{formatCurrency(business.financial.assets)}</p>
                  </div>
                )}
                {business.financial.equity && (
                  <div>
                    <p className="text-gray-500">Equity</p>
                    <p className="font-semibold text-purple-600">{formatCurrency(business.financial.equity)}</p>
                  </div>
                )}
                {business.financial.liabilities && (
                  <div>
                    <p className="text-gray-500">Liabilities</p>
                    <p className="font-semibold text-red-600">{formatCurrency(business.financial.liabilities)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-48 flex flex-col space-y-3">
          <button
            onClick={() => onViewDetails(business)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
          >
            <Building2 className="w-4 h-4 mr-2" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
