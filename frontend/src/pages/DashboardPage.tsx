import React from "react";
import { Link } from "react-router";
import { TrendingUp, Building2, Target, CheckCircle, AlertTriangle, DollarSign, FileText, Users } from "lucide-react";

const DashboardPage: React.FC = () => {
  // Mock data - replace with actual API calls
  const investmentReadinessScore = 67; // percentage
  const monthlyRevenue = 1250000000; // IDR
  const profitMargin = 15.5; // percentage
  const complianceScore = 78; // percentage

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Investment Readiness Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl shadow-xl text-white p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dasbor Kesiapan Investasi SINAR</h1>
            <p className="text-emerald-100">Lacak perjalanan Anda dari UMKM ke bisnis siap investasi dengan SINAR</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{investmentReadinessScore}%</div>
            <div className="text-sm text-emerald-100">Siap Investasi</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">IDR {(monthlyRevenue / 1000000000).toFixed(1)}B</p>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">{profitMargin}%</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Target className="w-3 h-3 mr-1" />
                Target: 20% for IPO
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">{complianceScore}%</p>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Need 95% for listing
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
              <p className="text-sm font-medium text-gray-600">Business Stage</p>
              <p className="text-lg font-bold text-gray-900">Growing</p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <Building2 className="w-3 h-3 mr-1" />
                Scale-up phase
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Investment Requirements Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Readiness Checklist</h3>
          <div className="space-y-4">
            {[
              { item: "Financial Audits (2 years)", completed: true, critical: true },
              { item: "Legal Compliance", completed: true, critical: true },
              { item: "Corporate Governance", completed: false, critical: true },
              { item: "Consistent Profitability", completed: false, critical: true },
              { item: "Business Valuation", completed: false, critical: false },
              { item: "Growth Strategy Documentation", completed: false, critical: false },
            ].map((req, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${req.completed ? "bg-emerald-100" : "bg-gray-100"}`}>
                    {req.completed && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                  </div>
                  <span className={`text-sm ${req.completed ? "text-gray-900" : "text-gray-600"}`}>{req.item}</span>
                </div>
                {req.critical && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Critical</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/business" className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-lg transition-colors duration-200 text-center block">
              <Building2 className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Manage Business</span>
            </Link>

            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors duration-200 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Generate Report</span>
            </button>

            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors duration-200 text-center">
              <Target className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Set Goals</span>
            </button>

            <Link to="/investments" className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg transition-colors duration-200 text-center block">
              <DollarSign className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Investments</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Growth Recommendations */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Investment Readiness Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Improve Profit Margin</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your current profit margin of {profitMargin}% needs to reach 20% to attract private investors. Consider optimizing operational costs and increasing revenue streams.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Complete Corporate Governance</h4>
              <p className="text-sm text-gray-600 mt-1">Establish board of directors, audit committee, and implement proper internal controls to meet private equity investment requirements.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
