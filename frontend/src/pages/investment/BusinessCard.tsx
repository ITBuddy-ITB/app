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
    <div
      className="rounded-2xl shadow-xl border p-8 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(241, 237, 234, 0.9)",
        borderColor: "rgba(96, 42, 29, 0.2)",
        boxShadow: "0 8px 32px rgba(96, 42, 29, 0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 16px 48px rgba(96, 42, 29, 0.2)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(96, 42, 29, 0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Company Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: "#602a1d" }}>
                {business.name}
              </h3>
              <p className="mb-4" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
                {business.description || "No description available"}
              </p>
              <div className="flex items-center space-x-4">
                {business.industry && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: "rgba(96, 42, 29, 0.1)",
                      borderColor: "rgba(96, 42, 29, 0.3)",
                      color: "#602a1d",
                    }}>
                    {business.industry}
                  </span>
                )}
                {business.type && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: "rgba(96, 42, 29, 0.08)",
                      borderColor: "rgba(96, 42, 29, 0.25)",
                      color: "rgba(96, 42, 29, 0.8)",
                    }}>
                    {business.type}
                  </span>
                )}
              </div>
            </div>
            {business.market_cap && (
              <div className="text-right">
                <div className="text-2xl font-bold mb-1" style={{ color: "#602a1d" }}>
                  {formatCurrency(business.market_cap)}
                </div>
                <div className="text-sm" style={{ color: "rgba(96, 42, 29, 0.6)" }}>
                  Market Cap
                </div>
              </div>
            )}
          </div>

          {/* Business Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs mb-1" style={{ color: "rgba(96, 42, 29, 0.6)" }}>
                Founded
              </p>
              <p className="font-semibold" style={{ color: "#602a1d" }}>
                {business.founded_at ? new Date(business.founded_at).getFullYear() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "rgba(96, 42, 29, 0.6)" }}>
                Legal Docs
              </p>
              <p className="font-semibold flex items-center" style={{ color: "#602a1d" }}>
                <FileText className="w-4 h-4 mr-1" />
                {business.legals?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "rgba(96, 42, 29, 0.6)" }}>
                Financial Data
              </p>
              <p className="font-semibold flex items-center" style={{ color: "#602a1d" }}>
                <BarChart3 className="w-4 h-4 mr-1" />
                {business.financial ? "Available" : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "rgba(96, 42, 29, 0.6)" }}>
                Products
              </p>
              <p className="font-semibold" style={{ color: "#602a1d" }}>
                {business.products?.length || 0}
              </p>
            </div>
          </div>

          {/* Financial Highlights */}
          {business.financial && (
            <div
              className="rounded-lg p-4 mb-4 border"
              style={{
                backgroundColor: "rgba(219, 215, 210, 0.5)",
                borderColor: "rgba(96, 42, 29, 0.2)",
              }}>
              <h4 className="text-sm font-medium mb-2" style={{ color: "#602a1d" }}>
                Financial Highlights
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {business.financial.ebitda && (
                  <div>
                    <p style={{ color: "rgba(96, 42, 29, 0.6)" }}>EBITDA</p>
                    <p className="font-semibold" style={{ color: "#602a1d" }}>
                      {formatCurrency(business.financial.ebitda)}
                    </p>
                  </div>
                )}
                {business.financial.assets && (
                  <div>
                    <p style={{ color: "rgba(96, 42, 29, 0.6)" }}>Assets</p>
                    <p className="font-semibold" style={{ color: "#602a1d" }}>
                      {formatCurrency(business.financial.assets)}
                    </p>
                  </div>
                )}
                {business.financial.equity && (
                  <div>
                    <p style={{ color: "rgba(96, 42, 29, 0.6)" }}>Equity</p>
                    <p className="font-semibold" style={{ color: "#602a1d" }}>
                      {formatCurrency(business.financial.equity)}
                    </p>
                  </div>
                )}
                {business.financial.liabilities && (
                  <div>
                    <p style={{ color: "rgba(96, 42, 29, 0.6)" }}>Liabilities</p>
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
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center border backdrop-blur-sm shadow-lg"
            style={{
              backgroundColor: "#602a1d",
              borderColor: "rgba(96, 42, 29, 0.3)",
              color: "#f1edea",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(96, 42, 29, 0.9)";
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(96, 42, 29, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#602a1d";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(96, 42, 29, 0.2)";
            }}>
            <Building2 className="w-4 h-4 mr-2" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
