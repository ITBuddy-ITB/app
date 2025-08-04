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
  BarChart3,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useInvestment } from "../../hooks/useInvestment";
import type { Business } from "../../services/businessService";
import { InvestmentService, INVESTMENT_STATUS, type Investment } from "../../services/investmentService";

const API_BASE_URL = "http://localhost:8080";

// Business Card Component
const BusinessCard: React.FC<{
  business: Business;
  onViewDetails: (business: Business) => void;
}> = ({ business, onViewDetails }) => {
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

// Business Details Modal Component
const BusinessDetailsModal: React.FC<{
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ business, isOpen, onClose }) => {
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);
  const [investmentError, setInvestmentError] = useState<string | null>(null);
  const [existingInvestments, setExistingInvestments] = useState<number>(0);
  const [isLoadingInvestments, setIsLoadingInvestments] = useState(false);
  const [investmentsList, setInvestmentsList] = useState<Investment[]>([]);

  // Fetch existing investments when modal opens
  useEffect(() => {
    if (isOpen && business) {
      const fetchExistingInvestments = async () => {
        setIsLoadingInvestments(true);
        try {
          const investments = await InvestmentService.getUserInvestmentsForBusiness(business.ID);
          const totalExisting = investments.reduce((sum, inv) => sum + inv.investment_amount, 0);
          setExistingInvestments(totalExisting);
          setInvestmentsList(investments);
        } catch (error) {
          console.error("Failed to fetch existing investments:", error);
          setExistingInvestments(0);
          setInvestmentsList([]);
        } finally {
          setIsLoadingInvestments(false);
        }
      };

      fetchExistingInvestments();
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

  // Calculate maximum investment amount
  const getMaxInvestment = (): number => {
    if (!business.financial?.ebitda) return 0;

    // Use revenue from financial data
    const revenue = business.financial.revenue || 0;
    const ebitdaMultiplier = calculateEBITDAMultiplier(revenue);

    return business.financial.ebitda * ebitdaMultiplier;
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
        const totalExisting = investments.reduce((sum, inv) => sum + inv.investment_amount, 0);
        setExistingInvestments(totalExisting);
        setInvestmentsList(investments);
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
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
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
                      <p className="text-gray-600">Your Existing</p>
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
