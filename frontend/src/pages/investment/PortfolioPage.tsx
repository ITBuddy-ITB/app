import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Building2,
  ArrowLeft,
  Calendar,
  Target,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { InvestmentService, INVESTMENT_STATUS, type Investment } from "../../services/investmentService";

const PortofolioPage: React.FC = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const userInvestments = await InvestmentService.getUserInvestments();
        setInvestments(userInvestments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch investments");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const formatCurrency = (amount?: number) => {
    if (!amount) return "IDR 0";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case INVESTMENT_STATUS.BUYING:
      case INVESTMENT_STATUS.PENDING:
        return <Clock className="w-4 h-4" />;
      case INVESTMENT_STATUS.APPROVED:
      case INVESTMENT_STATUS.FUNDED:
      case INVESTMENT_STATUS.ACTIVE:
        return <CheckCircle className="w-4 h-4" />;
      case INVESTMENT_STATUS.EXITED:
        return <TrendingUp className="w-4 h-4" />;
      case INVESTMENT_STATUS.REJECTED:
      case INVESTMENT_STATUS.CANCELLED:
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Handle selling investment (update status to "exited")
  const handleSellInvestment = async (investmentId: number) => {
    setUpdatingStatus((prev) => ({ ...prev, [investmentId]: true }));
    try {
      await InvestmentService.updateInvestmentStatus(investmentId, INVESTMENT_STATUS.EXITED);

      // Update local state to reflect the change
      setInvestments((prev) =>
        prev.map((inv) =>
          inv.ID === investmentId
            ? { ...inv, investment_status: INVESTMENT_STATUS.EXITED, time_sold: new Date().toISOString() }
            : inv
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sell investment");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [investmentId]: false }));
    }
  };

  // Check if investment can be sold (not already exited, rejected, or cancelled)
  const canSellInvestment = (status: string) => {
    return (
      status !== INVESTMENT_STATUS.EXITED &&
      status !== INVESTMENT_STATUS.REJECTED &&
      status !== INVESTMENT_STATUS.CANCELLED
    );
  };

  // Calculate portfolio statistics
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investment_amount, 0);
  const activeInvestments = investments.filter(
    (inv) =>
      inv.investment_status === INVESTMENT_STATUS.ACTIVE ||
      inv.investment_status === INVESTMENT_STATUS.FUNDED ||
      inv.investment_status === INVESTMENT_STATUS.APPROVED
  );
  const exitedInvestments = investments.filter((inv) => inv.investment_status === INVESTMENT_STATUS.EXITED);
  const pendingInvestments = investments.filter(
    (inv) => inv.investment_status === INVESTMENT_STATUS.BUYING || inv.investment_status === INVESTMENT_STATUS.PENDING
  );

  const activeInvestedAmount = activeInvestments.reduce((sum, inv) => sum + inv.investment_amount, 0);
  const exitedInvestedAmount = exitedInvestments.reduce((sum, inv) => sum + inv.investment_amount, 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/investments")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Investments
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Investment <span className="text-green-600">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track and manage all your investment activities in one place
          </p>
        </div>
      </div>

      {/* Portfolio Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested)}</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <DollarSign className="w-3 h-3 mr-1" />
                Portfolio value
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Investments</p>
              <p className="text-2xl font-bold text-gray-900">{activeInvestments.length}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                {formatCurrency(activeInvestedAmount)}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Exited Investments</p>
              <p className="text-2xl font-bold text-gray-900">{exitedInvestments.length}</p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {formatCurrency(exitedInvestedAmount)}
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingInvestments.length}</p>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" />
                Awaiting approval
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Investments</p>
              <p className="text-2xl font-bold text-gray-900">{investments.length}</p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <BarChart3 className="w-3 h-3 mr-1" />
                All time
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Investments List */}
      <div className="space-y-6">
        {/* Active Investments Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Active Investments ({activeInvestments.length})
              </h2>
              <span className="text-sm font-medium text-green-600">Total: {formatCurrency(activeInvestedAmount)}</span>
            </div>
          </div>

          {activeInvestments.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No active investments</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activeInvestments.map((investment) => (
                <div key={investment.ID} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {investment.business?.name || `Business #${investment.business_id}`}
                        </h3>
                        <p className="text-sm text-gray-500">Investment #{investment.ID}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(investment.investment_amount)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(investment.CreatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            investment.investment_status
                          )}`}
                        >
                          {getStatusIcon(investment.investment_status)}
                          <span className="ml-1">
                            {investment.investment_status.charAt(0).toUpperCase() +
                              investment.investment_status.slice(1)}
                          </span>
                        </span>
                      </div>

                      {/* Sell Button */}
                      <div className="text-right">
                        <button
                          onClick={() => handleSellInvestment(investment.ID)}
                          disabled={updatingStatus[investment.ID]}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {updatingStatus[investment.ID] ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Selling...
                            </>
                          ) : (
                            <>
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Sell
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional investment details */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {investment.time_bought && (
                      <div>
                        <p className="text-gray-500">Bought On</p>
                        <p className="font-medium text-gray-900">
                          {new Date(investment.time_bought).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {investment.business?.industry && (
                      <div>
                        <p className="text-gray-500">Industry</p>
                        <p className="font-medium text-gray-900">{investment.business.industry}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exited Investments Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                Exited Investments ({exitedInvestments.length})
              </h2>
              <span className="text-sm font-medium text-orange-600">Total: {formatCurrency(exitedInvestedAmount)}</span>
            </div>
          </div>

          {exitedInvestments.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No exited investments</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {exitedInvestments.map((investment) => (
                <div key={investment.ID} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {investment.business?.name || `Business #${investment.business_id}`}
                        </h3>
                        <p className="text-sm text-gray-500">Investment #{investment.ID}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(investment.investment_amount)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">Invested</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(investment.CreatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            investment.investment_status
                          )}`}
                        >
                          {getStatusIcon(investment.investment_status)}
                          <span className="ml-1">Exited</span>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm text-gray-400 px-4 py-2">Sold</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional investment details */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {investment.time_bought && (
                      <div>
                        <p className="text-gray-500">Bought On</p>
                        <p className="font-medium text-gray-900">
                          {new Date(investment.time_bought).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {investment.time_sold && (
                      <div>
                        <p className="text-gray-500">Sold On</p>
                        <p className="font-medium text-gray-900">
                          {new Date(investment.time_sold).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {investment.business?.industry && (
                      <div>
                        <p className="text-gray-500">Industry</p>
                        <p className="font-medium text-gray-900">{investment.business.industry}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other Investments Section (Pending, Rejected, Cancelled) */}
        {investments.filter(
          (inv) =>
            inv.investment_status !== INVESTMENT_STATUS.ACTIVE &&
            inv.investment_status !== INVESTMENT_STATUS.FUNDED &&
            inv.investment_status !== INVESTMENT_STATUS.APPROVED &&
            inv.investment_status !== INVESTMENT_STATUS.EXITED
        ).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertCircle className="w-5 h-5 text-gray-600 mr-2" />
                Other Investments
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {investments
                .filter(
                  (inv) =>
                    inv.investment_status !== INVESTMENT_STATUS.ACTIVE &&
                    inv.investment_status !== INVESTMENT_STATUS.FUNDED &&
                    inv.investment_status !== INVESTMENT_STATUS.APPROVED &&
                    inv.investment_status !== INVESTMENT_STATUS.EXITED
                )
                .map((investment) => (
                  <div key={investment.ID} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {investment.business?.name || `Business #${investment.business_id}`}
                          </h3>
                          <p className="text-sm text-gray-500">Investment #{investment.ID}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(investment.investment_amount)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="text-sm font-medium text-gray-900 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(investment.CreatedAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Status</p>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              investment.investment_status
                            )}`}
                          >
                            {getStatusIcon(investment.investment_status)}
                            <span className="ml-1">
                              {investment.investment_status.charAt(0).toUpperCase() +
                                investment.investment_status.slice(1)}
                            </span>
                          </span>
                        </div>

                        <div className="text-right">
                          {canSellInvestment(investment.investment_status) ? (
                            <button
                              onClick={() => handleSellInvestment(investment.ID)}
                              disabled={updatingStatus[investment.ID]}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {updatingStatus[investment.ID] ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Selling...
                                </>
                              ) : (
                                <>
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                  Sell
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400 px-4 py-2">Cannot sell</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional investment details */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {investment.time_bought && (
                        <div>
                          <p className="text-gray-500">Bought On</p>
                          <p className="font-medium text-gray-900">
                            {new Date(investment.time_bought).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {investment.business?.industry && (
                        <div>
                          <p className="text-gray-500">Industry</p>
                          <p className="font-medium text-gray-900">{investment.business.industry}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Empty State - No investments at all */}
        {investments.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No investments yet</p>
              <p className="text-gray-400 mb-6">Start investing in promising businesses to build your portfolio</p>
              <button
                onClick={() => navigate("/investments")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Explore Investment Opportunities
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortofolioPage;
