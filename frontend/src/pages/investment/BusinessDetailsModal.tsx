import React, { useState, useEffect } from "react";
import type { Business, Financial } from "../../services/businessService";
import { BusinessService } from "../../services/businessService";
import { InvestmentService, INVESTMENT_STATUS, type Investment } from "../../services/investmentService";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const API_BASE_URL = "http://localhost:8080";

interface BusinessDetailsModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({ business, isOpen, onClose }) => {
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);
  const [investmentError, setInvestmentError] = useState<string | null>(null);
  const [existingInvestments, setExistingInvestments] = useState<number>(0);
  const [isLoadingInvestments, setIsLoadingInvestments] = useState(false);
  const [investmentsList, setInvestmentsList] = useState<Investment[]>([]);
  const [financialHistory, setFinancialHistory] = useState<Financial[]>([]);

  useEffect(() => {
    if (isOpen && business) {
      const fetchExistingInvestments = async () => {
        setIsLoadingInvestments(true);
        try {
          const investments = await InvestmentService.getUserInvestmentsForBusiness(business.ID);
          // Only count active investments for capacity calculation
          const activeInvestments = investments.filter((inv) => inv.investment_status === INVESTMENT_STATUS.ACTIVE);
          const totalExisting = activeInvestments.reduce((sum, inv) => sum + inv.investment_amount, 0);
          setExistingInvestments(totalExisting);
          setInvestmentsList(investments); // Show all investments in the list
        } catch (error) {
          console.error("Failed to fetch existing investments:", error);
          setExistingInvestments(0);
          setInvestmentsList([]);
        } finally {
          setIsLoadingInvestments(false);
        }
      };

      const fetchFinancialHistory = async () => {
        try {
          const history = await BusinessService.getBusinessFinancialHistory(business.ID);
          setFinancialHistory(history);
        } catch (error) {
          console.error("Failed to fetch financial history:", error);
          setFinancialHistory([]);
        }
      };

      fetchExistingInvestments();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case INVESTMENT_STATUS.BUYING:
        return "bg-blue-100 text-blue-800";
      case INVESTMENT_STATUS.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case INVESTMENT_STATUS.APPROVED:
        return "bg-green-100 text-green-800";
      case INVESTMENT_STATUS.FUNDED:
        return "bg-emerald-100 text-emerald-800";
      case INVESTMENT_STATUS.ACTIVE:
        return "bg-purple-100 text-purple-800";
      case INVESTMENT_STATUS.EXITED:
        return "bg-orange-100 text-orange-800";
      case INVESTMENT_STATUS.REJECTED:
        return "bg-red-100 text-red-800";
      case INVESTMENT_STATUS.CANCELLED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  // Calculate maximum investment amount
  const getMaxInvestment = (): number => {
    return currentBusinessValue; // Business value is the market cap which equals max investment
  };

  // Calculate remaining investment capacity (max - existing)
  const getRemainingInvestment = (): number => {
    return Math.max(0, getMaxInvestment() - existingInvestments);
  };

  // Calculate minimum investment amount
  const getMinInvestment = (): number => {
    const remaining = getRemainingInvestment();
    if (remaining <= 0) return 0;

    return Math.min(Math.max(remaining * 0.001), remaining);
  };

  const maxInvestment = getMaxInvestment();
  const remainingInvestment = getRemainingInvestment();
  const minInvestment = getMinInvestment();

  // Calculate equity percentage based on investment amount
  const calculateEquityPercentage = (amount: number): number => {
    if (!business.financial?.equity || business.financial.equity === 0) return 0;
    return Math.min((amount / business.financial.equity) * 100, 100);
  };

  const handleInvestmentChange = (value: number) => {
    // Ensure the value is within min and remaining bounds
    const clampedValue = Math.max(0, Math.min(value, remainingInvestment));
    setInvestmentAmount(clampedValue);
  };

  const handleInvestment = async () => {
    if (!business || investmentAmount < minInvestment) return;

    setIsInvesting(true);
    setInvestmentError(null);

    try {
      await InvestmentService.createInvestment({
        business_id: business.ID,
        investment_amount: investmentAmount,
        investment_status: INVESTMENT_STATUS.BUYING,
        time_bought: new Date().toISOString(),
      });

      setInvestmentSuccess(true);
      setInvestmentAmount(0);

      // Refresh existing investments to show updated totals
      try {
        const investments = await InvestmentService.getUserInvestmentsForBusiness(business.ID);
        // Only count active investments for capacity calculation
        const activeInvestments = investments.filter((inv) => inv.investment_status === INVESTMENT_STATUS.ACTIVE);
        const totalExisting = activeInvestments.reduce((sum, inv) => sum + inv.investment_amount, 0);
        setExistingInvestments(totalExisting);
        setInvestmentsList(investments); // Show all investments in the list
      } catch (error) {
        console.error("Failed to refresh existing investments:", error);
      }

      // Show success for 3 seconds then close modal
      setTimeout(() => {
        setInvestmentSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      setInvestmentError(error instanceof Error ? error.message : "Failed to create investment");
    } finally {
      setIsInvesting(false);
    }
  };

  const equityPercentage = calculateEquityPercentage(investmentAmount);

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

          {/* Existing Investments */}
          {investmentsList.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Your Existing Investments</h3>
              <div className="space-y-3">
                {investmentsList.map((investment) => (
                  <div key={investment.ID} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">Investment #{investment.ID}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Amount: {formatCurrency(investment.investment_amount)}</span>
                          <span>Date: {new Date(investment.CreatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          investment.investment_status
                        )}`}
                      >
                        {investment.investment_status.charAt(0).toUpperCase() + investment.investment_status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investment Action */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Investment Calculator</h3>

            {/* Success Message */}
            {investmentSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-semibold">Investment Created Successfully!</p>
                <p className="text-green-600 text-sm">
                  Your investment request has been submitted and is pending approval.
                </p>
              </div>
            )}

            {/* Error Message */}
            {investmentError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold">Investment Failed</p>
                <p className="text-red-600 text-sm">{investmentError}</p>
              </div>
            )}

            {business.financial?.ebitda ? (
              <div className="space-y-6">
                {/* Investment Capacity Information */}
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Investment Capacity</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Capacity</p>
                      <p className="font-semibold text-blue-600">{formatCurrency(maxInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Your Active Investments</p>
                      <p className="font-semibold text-orange-600">
                        {isLoadingInvestments ? "Loading..." : formatCurrency(existingInvestments)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Remaining Available</p>
                      <p className="font-semibold text-green-600">{formatCurrency(remainingInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">EBITDA Multiplier</p>
                      <p className="font-semibold text-purple-600">
                        {calculateEBITDAMultiplier(business.financial?.revenue || 0)}x
                      </p>
                    </div>
                  </div>
                  {remainingInvestment <= 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800 text-sm font-medium">
                        ⚠️ You have reached the maximum investment capacity for this business.
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Min Investment</p>
                    <p className="font-semibold text-orange-600">{formatCurrency(minInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Max This Investment</p>
                    <p className="font-semibold text-blue-600">{formatCurrency(remainingInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Est. New Equity %</p>
                    <p className="font-semibold text-purple-600">{equityPercentage.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Progress</p>
                    <p className="font-semibold text-gray-700">
                      {((existingInvestments / maxInvestment) * 100).toFixed(1)}% used
                    </p>
                  </div>
                </div>

                {/* Investment Amount Input */}
                <div>
                  <label htmlFor="investment-amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount (IDR)
                  </label>
                  <input
                    type="number"
                    id="investment-amount"
                    value={investmentAmount}
                    onChange={(e) => handleInvestmentChange(Number(e.target.value))}
                    min={minInvestment}
                    max={remainingInvestment}
                    step={1000000} // 1M IDR steps
                    disabled={remainingInvestment <= 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={
                      remainingInvestment <= 0
                        ? "No capacity remaining"
                        : `Enter amount (min: ${formatCurrency(minInvestment)})`
                    }
                  />
                  {investmentAmount > 0 && investmentAmount < minInvestment && (
                    <p className="text-red-600 text-xs mt-1">
                      Minimum investment amount is {formatCurrency(minInvestment)}
                    </p>
                  )}
                  {investmentAmount > remainingInvestment && (
                    <p className="text-red-600 text-xs mt-1">
                      Amount exceeds remaining capacity of {formatCurrency(remainingInvestment)}
                    </p>
                  )}
                </div>

                {/* Investment Slider */}
                <div>
                  <label htmlFor="investment-slider" className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount Slider
                  </label>
                  <input
                    type="range"
                    id="investment-slider"
                    value={investmentAmount}
                    onChange={(e) => handleInvestmentChange(Number(e.target.value))}
                    min={minInvestment}
                    max={remainingInvestment}
                    step={remainingInvestment > 0 ? (remainingInvestment - minInvestment) / 100 : 0} // 100 steps
                    disabled={remainingInvestment <= 0}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                    style={{
                      background:
                        remainingInvestment > 0
                          ? `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                              ((investmentAmount - minInvestment) / (remainingInvestment - minInvestment)) * 100
                            }%, #E5E7EB ${
                              ((investmentAmount - minInvestment) / (remainingInvestment - minInvestment)) * 100
                            }%, #E5E7EB 100%)`
                          : "#E5E7EB",
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatCurrency(minInvestment)}</span>
                    <span>{formatCurrency(remainingInvestment)}</span>
                  </div>
                </div>

                {/* Quick Investment Amounts */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Quick Select</p>
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => handleInvestmentChange(minInvestment)}
                      disabled={remainingInvestment <= 0}
                      className={`px-3 py-2 text-xs rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        Math.abs(investmentAmount - minInvestment) < 1000
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Min
                    </button>
                    {[0.25, 0.5, 0.75, 1].map((percentage) => {
                      const amount = minInvestment + (remainingInvestment - minInvestment) * percentage;
                      return (
                        <button
                          key={percentage}
                          onClick={() => handleInvestmentChange(amount)}
                          disabled={remainingInvestment <= 0}
                          className={`px-3 py-2 text-xs rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            Math.abs(investmentAmount - amount) < 1000
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {percentage === 1 ? "Max" : `${percentage * 100}%`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Investment Summary */}
                {investmentAmount > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Investment Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">This Investment</p>
                        <p className="font-semibold text-blue-600">{formatCurrency(investmentAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">New Equity %</p>
                        <p className="font-semibold text-purple-600">{equityPercentage.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total After Investment</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(existingInvestments + investmentAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Remaining Capacity</p>
                        <p className="font-semibold text-orange-600">
                          {formatCurrency(remainingInvestment - investmentAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">% of Total Capacity</p>
                        <p className="font-semibold text-gray-700">
                          {(((existingInvestments + investmentAmount) / maxInvestment) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Investment Type</p>
                        <p className="font-semibold text-gray-700">
                          {equityPercentage < 10
                            ? "Minority"
                            : equityPercentage < 25
                            ? "Significant"
                            : equityPercentage < 50
                            ? "Major"
                            : "Controlling"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleInvestment}
                    disabled={
                      investmentAmount < minInvestment || isInvesting || investmentSuccess || remainingInvestment <= 0
                    }
                    className={`flex-1 px-6 py-3 rounded-md transition-colors font-semibold ${
                      investmentAmount >= minInvestment && !isInvesting && !investmentSuccess && remainingInvestment > 0
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isInvesting ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Investment...
                      </>
                    ) : investmentSuccess ? (
                      "Investment Created!"
                    ) : remainingInvestment <= 0 ? (
                      "Maximum Capacity Reached"
                    ) : investmentAmount === 0 ? (
                      `Enter Investment (Min: ${formatCurrency(minInvestment)})`
                    ) : investmentAmount < minInvestment ? (
                      `Below Minimum (${formatCurrency(minInvestment)})`
                    ) : (
                      `Invest ${formatCurrency(investmentAmount)}`
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setInvestmentAmount(0);
                      setInvestmentError(null);
                      setInvestmentSuccess(false);
                    }}
                    disabled={isInvesting}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">
                  Financial data (EBITDA) is required to calculate investment opportunities.
                </p>
                <p className="text-sm text-gray-500">
                  Contact the business owner for more detailed financial information.
                </p>
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Contact Business Owner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsModal;
