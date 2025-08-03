import React from "react";
import Navbar from "../../components/Navbar";
import { TrendingUp, DollarSign, Building2, Star, ArrowUpRight, Users, Target } from "lucide-react";

const InvestmentPage: React.FC = () => {
  // Mock investment opportunities data
  const investmentOpportunities = [
    {
      id: 1,
      companyName: "TechStart Indonesia",
      industry: "Technology",
      stage: "Growth",
      valuation: 50000000000, // IDR
      fundingGoal: 10000000000, // IDR
      raised: 7500000000, // IDR
      investmentReadiness: 85,
      description: "AI-powered e-commerce platform serving Indonesian SMEs",
      riskLevel: "Medium",
      expectedReturn: "15-25%",
      minInvestment: 100000000, // IDR
    },
    {
      id: 2,
      companyName: "Green Energy Solutions",
      industry: "Clean Energy",
      stage: "Scale-up",
      valuation: 75000000000, // IDR
      fundingGoal: 15000000000, // IDR
      raised: 12000000000, // IDR
      investmentReadiness: 78,
      description: "Solar panel manufacturing and installation for Indonesian market",
      riskLevel: "Low",
      expectedReturn: "12-20%",
      minInvestment: 250000000, // IDR
    },
    {
      id: 3,
      companyName: "AgriTech Nusantara",
      industry: "Agriculture",
      stage: "Investment Ready",
      valuation: 30000000000, // IDR
      fundingGoal: 8000000000, // IDR
      raised: 6500000000, // IDR
      investmentReadiness: 92,
      description: "Smart farming solutions for Indonesian agriculture sector",
      riskLevel: "Medium",
      expectedReturn: "18-30%",
      minInvestment: 150000000, // IDR
    },
  ];

  const formatIDR = (amount: number) => {
    if (amount >= 1000000000) {
      return `IDR ${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `IDR ${(amount / 1000000).toFixed(0)}M`;
    }
    return `IDR ${amount.toLocaleString()}`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-emerald-600 bg-emerald-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "High":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Investment Ready":
        return "text-emerald-600 bg-emerald-100";
      case "Growth":
        return "text-blue-600 bg-blue-100";
      case "Scale-up":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Private <span className="text-blue-600">Investment</span> Opportunities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Invest in promising Indonesian businesses transitioning from UMKM to investment-ready companies. Support growth while earning attractive returns.
          </p>
        </div>

        {/* Investment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +8 this month
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
                <p className="text-sm font-medium text-gray-600">Total Capital</p>
                <p className="text-2xl font-bold text-gray-900">IDR 2.1T</p>
                <p className="text-xs text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Available to invest
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
                <p className="text-sm font-medium text-gray-600">Avg. Return</p>
                <p className="text-2xl font-bold text-gray-900">18.5%</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Star className="w-3 h-3 mr-1" />
                  Annual return
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Investors</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  Growing community
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Investment Opportunities */}
        <div className="grid gap-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Investment Opportunities</h2>

          {investmentOpportunities.map((opportunity) => {
            const fundingPercentage = (opportunity.raised / opportunity.fundingGoal) * 100;

            return (
              <div key={opportunity.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Company Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{opportunity.companyName}</h3>
                        <p className="text-gray-600 mb-4">{opportunity.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(opportunity.stage)}`}>{opportunity.stage}</span>
                          <span className="text-sm text-gray-500">{opportunity.industry}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(opportunity.riskLevel)}`}>{opportunity.riskLevel} Risk</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{opportunity.investmentReadiness}%</div>
                        <div className="text-sm text-gray-500">Investment Ready</div>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                        <span className="text-sm text-gray-500">{fundingPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min(fundingPercentage, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>Raised: {formatIDR(opportunity.raised)}</span>
                        <span>Goal: {formatIDR(opportunity.fundingGoal)}</span>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Valuation</p>
                        <p className="font-semibold text-gray-900">{formatIDR(opportunity.valuation)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Min. Investment</p>
                        <p className="font-semibold text-gray-900">{formatIDR(opportunity.minInvestment)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Expected Return</p>
                        <p className="font-semibold text-emerald-600">{opportunity.expectedReturn}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                        <p className="font-semibold text-gray-900">{opportunity.riskLevel}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:w-48 flex flex-col space-y-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Invest Now
                    </button>
                    <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
