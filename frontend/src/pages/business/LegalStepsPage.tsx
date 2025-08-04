import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

interface Step {
  step_number: number;
  description: string;
  redirect_url: string;
}

const LegalStepsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { steps, type } = location.state as { steps: Step[]; type: string };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Steps to Get {type}</h1>
          <button onClick={() => navigate(-1)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
            Back
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.step_number} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {step.step_number}
                </div>
                <div className="flex-grow">
                  <p className="text-gray-800">{step.description}</p>
                  {step.redirect_url && (
                    <a
                      href={step.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
                      Learn more →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalStepsPage;
