import React, { useState, useEffect } from "react";
import type { Business, Financial } from "../../services/businessService";
import { BusinessService } from "../../services/businessService";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const API_BASE_URL = "http://localhost:8080";

interface BusinessDetailsModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({ business, isOpen, onClose }) => {
  const [financialHistory, setFinancialHistory] = useState<Financial[]>([]);

  useEffect(() => {
    if (isOpen && business) {
      const fetchFinancialHistory = async () => {
        try {
          const history = await BusinessService.getBusinessFinancialHistory(business.ID);
          setFinancialHistory(history);
        } catch (error) {
          console.error("Failed to fetch financial history:", error);
          setFinancialHistory([]);
        }
      };

      fetchFinancialHistory();
    }
  }, [isOpen, business]);

  if (!isOpen || !business) return null;

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Not specified";
    if (amount >= 1000000000) {
      return `IDR ${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `IDR ${(amount / 1000000).toFixed(0)}M`;
    }
    return `IDR ${amount.toLocaleString()}`;
  };

  // Revenue thresholds and EBITDA multipliers (matching backend constants)
  const REVENUE_TIER_1 = 1_000_000_000; // 1B IDR
  const REVENUE_TIER_2 = 5_000_000_000; // 5B IDR
  const REVENUE_TIER_3 = 10_000_000_000; // 10B IDR
  const REVENUE_TIER_4 = 50_000_000_000; // 50B IDR

  const EBITDA_MULTIPLIER_MIN = 1.0; // For revenue < 1B IDR
  const EBITDA_MULTIPLIER_LOW = 2.0; // For revenue 1B-5B IDR
  const EBITDA_MULTIPLIER_MID = 3.0; // For revenue 5B-10B IDR
  const EBITDA_MULTIPLIER_HIGH = 4.0; // For revenue 10B-50B IDR
  const EBITDA_MULTIPLIER_MAX = 5.0; // For revenue > 50B IDR

  // Calculate EBITDA multiplier based on revenue (matching backend logic)
  const calculateEBITDAMultiplier = (revenue?: number): number => {
    if (!revenue || revenue < REVENUE_TIER_1) {
      return EBITDA_MULTIPLIER_MIN;
    } else if (revenue < REVENUE_TIER_2) {
      return EBITDA_MULTIPLIER_LOW;
    } else if (revenue < REVENUE_TIER_3) {
      return EBITDA_MULTIPLIER_MID;
    } else if (revenue < REVENUE_TIER_4) {
      return EBITDA_MULTIPLIER_HIGH;
    }
    return EBITDA_MULTIPLIER_MAX;
  };

  // Calculate market cap based on EBITDA and multiplier (business value)
  const calculateBusinessValue = (financial: Financial): number => {
    const revenue = financial.revenue || 0;
    const ebitdaMultiplier = calculateEBITDAMultiplier(revenue);
    return (financial.ebitda || 0) * ebitdaMultiplier;
  };

  // Generate historical business value data based on actual financial history
  const generateBusinessValueHistory = () => {
    if (financialHistory.length === 0) return [];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [];

    // Use actual financial history to create value timeline
    const sortedHistory = [...financialHistory].sort(
      (a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()
    );

    // If we have multiple financial records, create data points for each
    if (sortedHistory.length > 1) {
      sortedHistory.forEach((financial) => {
        const date = new Date(financial.CreatedAt);
        const value = calculateBusinessValue(financial);

        data.push({
          month: months[date.getMonth()],
          value: Math.max(value, 0),
          date: date.toISOString().split("T")[0],
        });
      });
    }

    // If no data generated, show current month with latest financial data
    if (data.length === 0) {
      const currentDate = new Date();
      const latestFinancial = sortedHistory[sortedHistory.length - 1];
      data.push({
        month: months[currentDate.getMonth()],
        value: calculateBusinessValue(latestFinancial),
        date: currentDate.toISOString().split("T")[0],
      });
    }

    return data;
  };

  const businessValueHistory = generateBusinessValueHistory();

  // Calculate current business value from the latest financial data
  let currentBusinessValue = 0;
  if (financialHistory.length > 0) {
    // Use the most recent financial record from history
    const latestFinancial = financialHistory[0]; // History is sorted DESC by CreatedAt from backend
    currentBusinessValue = calculateBusinessValue(latestFinancial);
  } else if (business.financial) {
    // Fallback to business.financial if no history available
    currentBusinessValue = calculateBusinessValue(business.financial);
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">{business.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium">{business.industry || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{business.type || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Market Cap</p>
                <p className="font-medium">{formatCurrency(business.market_cap)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Founded</p>
                <p className="font-medium">
                  {business.founded_at ? new Date(business.founded_at).getFullYear() : "Not specified"}
                </p>
              </div>
            </div>
            {business.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1">{business.description}</p>
              </div>
            )}
          </div>

          {/* Financial Information */}
          {business.financial && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Financial Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">EBITDA</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(business.financial.ebitda)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Assets</p>
                  <p className="text-lg font-semibold text-blue-600">{formatCurrency(business.financial.assets)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Liabilities</p>
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(business.financial.liabilities)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Equity</p>
                  <p className="text-lg font-semibold text-purple-600">{formatCurrency(business.financial.equity)}</p>
                </div>
              </div>
              {business.financial.notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Financial Notes</p>
                  <p className="mt-1">{business.financial.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Business Value Visualization with Chart.js */}
          {business.financial?.ebitda && currentBusinessValue > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Business Value Over Time</h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
                {/* Current Business Value */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-900">Current Business Value</h4>
                    <span className="text-sm text-gray-600">
                      EBITDA Multiplier: {calculateEBITDAMultiplier(business.financial?.revenue || 0)}x
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(currentBusinessValue)}</div>
                  <p className="text-sm text-gray-600">
                    Based on EBITDA of {formatCurrency(business.financial.ebitda)} × Revenue-based multiplier
                  </p>
                </div>
              </div>
            </div>
          )}

          {businessValueHistory.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Business Value Over Time</h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg relative z-0">
                <div className="w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={businessValueHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Business Value"
                        stroke="#3182CE"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Legal Documents */}
          {business.legals && business.legals.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Legal Documents</h3>
              <div className="space-y-3">
                {business.legals.map((legal) => (
                  <div key={legal.ID} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{legal.file_name || "Legal Document"}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          {legal.legal_type && <span>Type: {legal.legal_type}</span>}
                          {legal.issued_by && <span>Issued by: {legal.issued_by}</span>}
                          {legal.valid_until && (
                            <span>Valid until: {new Date(legal.valid_until).toLocaleDateString()}</span>
                          )}
                        </div>
                        {legal.notes && <p className="mt-2 text-sm">{legal.notes}</p>}
                      </div>
                      {legal.file_url && (
                        <a
                          href={`${API_BASE_URL}${legal.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {business.products && business.products.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.products.map((product) => (
                  <div key={product.ID} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{product.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsModal;
