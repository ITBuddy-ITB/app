import React from "react";
import { Link } from "react-router";
import { SearchCheck, SpellCheck, BanknoteArrowUp } from "lucide-react";
import Navbar from "../components/Navbar";

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
        <div className="px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Evaluate. Comply. Invest.</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">AI-powered business platform — check your compliance, showcase your growth, and invest in other businesses.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard/businesses" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Start Business
            </Link>
            <Link to="/dashboard/investments" className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Browse Investment Opportunities
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <SearchCheck className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Step-by-Step Process</h3>
            <p className="text-gray-600">Profile, legal, and financial checklists — guided by AI.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <SpellCheck className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Compliance</h3>
            <p className="text-gray-600">Instantly see missing documents and get step-by-step guidance to complete them.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BanknoteArrowUp className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Invest in Growth</h3>
            <p className="text-gray-600">Discover and fund promising businesses directly from your dashboard.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
