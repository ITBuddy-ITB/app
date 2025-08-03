import React from "react";
import { Link } from "react-router";
import { TrendingUp, Building2, Trophy, CheckCircle, Banknote, FileCheck, Scale, Users } from "lucide-react";
import Navbar from "../components/Navbar";

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
        <div className="px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full mb-6">
            <Trophy className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">From UMKM to Investment Ready</span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Scale Your <span className="text-emerald-600">UMKM</span> to
            <br />
            <span className="text-blue-600">Investment Ready</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your small business into an investment-ready company. Our AI-powered platform guides you through financial compliance, legal requirements, and growth metrics needed to attract
            private investors and equity partners.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/business" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
              <Building2 className="w-5 h-5 mr-2" />
              Start Growth Journey
            </Link>
            <Link
              to="/investments"
              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
              <Banknote className="w-5 h-5 mr-2" />
              Find Investment Opportunities
            </Link>
          </div>

          {/* Growth Path Visualization */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Path to Private Investment</h3>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
              {[
                { step: "1", title: "UMKM", subtitle: "Small Business", icon: Building2, color: "bg-red-100 text-red-600" },
                { step: "2", title: "Compliance", subtitle: "Legal & Financial", icon: CheckCircle, color: "bg-yellow-100 text-yellow-600" },
                { step: "3", title: "Growth", subtitle: "Scale Operations", icon: TrendingUp, color: "bg-blue-100 text-blue-600" },
                { step: "4", title: "Investment Ready", subtitle: "Private Equity", icon: Trophy, color: "bg-emerald-100 text-emerald-600" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.subtitle}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute mt-8 ml-16">
                      <div className="w-16 h-0.5 bg-gray-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-8 hover:shadow-xl transition-shadow duration-200">
            <div className="h-14 w-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <FileCheck className="text-emerald-600 w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Compliance</h3>
            <p className="text-gray-600 leading-relaxed">
              Meet all financial reporting requirements for private investment. Track profit margins, cash flow, and financial ratios needed to attract equity partners.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8 hover:shadow-xl transition-shadow duration-200">
            <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Scale className="text-blue-600 w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Documentation</h3>
            <p className="text-gray-600 leading-relaxed">
              Ensure all legal requirements are met including corporate governance, regulatory compliance, and documentation for private investment and equity partnerships.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8 hover:shadow-xl transition-shadow duration-200">
            <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="text-purple-600 w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth Metrics</h3>
            <p className="text-gray-600 leading-relaxed">Monitor key performance indicators including revenue growth, market share, and operational efficiency to demonstrate business scalability.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
