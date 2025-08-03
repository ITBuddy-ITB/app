import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";
import api from "../../lib/api";

interface Business {
  id: number;
  name: string;
  type: string;
  industry: string;
  description: string;
}

const BusinessPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/business/user`);
        setBusinesses(res.data);
      } catch (err: unknown) {
        console.error("Failed to load businesses:", err);
        setError("Failed to load businesses");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

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

          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Your Businesses</h3>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : businesses.length === 0 ? (
              <p className="text-gray-500">You don’t have any businesses yet.</p>
            ) : (
              <ul className="space-y-3">
                {businesses.map((b) => (
                  <li key={b.id} className="flex justify-between items-center">
                    <span>🏢 {b.name}</span>
                    <Link to={`/business/${b.id}/step-2`} className="text-sm text-blue-600 hover:underline">
                      Continue Evaluation
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
