import React from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";

const BusinessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Business Evaluation</h2>
        <p className="text-gray-600 mb-8">
          Evaluate your business step by step. You can start a new evaluation or continue where you left off.
        </p>

        <div className="space-y-6">
          <Link
            to="/business/step-1"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
            Start New Evaluation
          </Link>

          {/* Example list of businesses already being evaluated */}
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Your Businesses</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span>🚀 Tech Startup Ltd.</span>
                <span className="text-sm text-blue-600">In Progress (Step 2)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>🏪 Retail Mart</span>
                <span className="text-sm text-green-600">Completed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
