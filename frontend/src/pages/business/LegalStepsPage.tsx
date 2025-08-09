import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import type { LegalStep } from "../../services/businessService";

interface LocationState {
  steps: LegalStep[];
  type: string;
}

const LegalStepsPage: React.FC = () => {
  const { legalType } = useParams<{ legalType: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [steps, setSteps] = useState<LegalStep[]>([]);
  const [legalTypeName, setLegalTypeName] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.steps && state?.type) {
      setSteps(state.steps);
      setLegalTypeName(state.type);
    } else if (legalType) {
      setLegalTypeName(decodeURIComponent(legalType));
      navigate(-1);
    } else {
      navigate(-1);
    }
  }, [location.state, legalType, navigate]);

  const handleStepComplete = (stepNumber: number) => {
    const newCompletedSteps = new Set(completedSteps);
    if (completedSteps.has(stepNumber)) {
      newCompletedSteps.delete(stepNumber);
    } else {
      newCompletedSteps.add(stepNumber);
    }
    setCompletedSteps(newCompletedSteps);
  };

  const handleRedirect = (url: string) => {
    setLoading(true);
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate(url);
    }
    setTimeout(() => setLoading(false), 1000);
  };

  const getProgressPercentage = () => {
    return steps.length > 0 ? (completedSteps.size / steps.length) * 100 : 0;
  };

  const isStepAccessible = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    return completedSteps.has(stepNumber - 1);
  };

  if (steps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat langkah...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Persyaratan Legal
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cara Mendapatkan: {legalTypeName}</h1>

          <p className="text-gray-600 mb-6">Ikuti langkah-langkah berikut untuk mendapatkan dokumen legal Anda.</p>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progres</span>
              <span className="text-sm font-medium text-gray-700">
                {completedSteps.size} dari {steps.length} langkah selesai
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            {getProgressPercentage() === 100 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-green-800 font-medium">Semua langkah selesai! 🎉</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          {steps.map((step) => {
            const isCompleted = completedSteps.has(step.step_number);
            const isAccessible = isStepAccessible(step.step_number);
            const isCurrent = currentStep === step.step_number;

            return (
              <div
                key={step.step_number}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 ${
                  isCurrent
                    ? "border-blue-500 shadow-lg"
                    : isCompleted
                    ? "border-green-200"
                    : isAccessible
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-gray-100 opacity-60"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Step Number/Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        isCompleted
                          ? "bg-green-100 text-green-800"
                          : isAccessible
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        step.step_number
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-3 ${isAccessible ? "text-gray-900" : "text-gray-400"}`}>
                        Langkah {step.step_number}
                      </h3>

                      <p className={`mb-4 leading-relaxed ${isAccessible ? "text-gray-700" : "text-gray-400"}`}>
                        {step.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleRedirect(step.redirect_url)}
                          disabled={!isAccessible || loading}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isAccessible
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Memuat...
                            </div>
                          ) : step.redirect_url.startsWith("http") ? (
                            <div className="flex items-center">
                              <span>Buka Tautan</span>
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </div>
                          ) : (
                            "Ke Panduan"
                          )}
                        </button>

                        <button
                          onClick={() => handleStepComplete(step.step_number)}
                          disabled={!isAccessible}
                          className={`px-4 py-2 rounded-lg font-medium border-2 transition-all duration-200 ${
                            isCompleted
                              ? "bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                              : isAccessible
                              ? "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                              : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {isCompleted ? (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Selesai
                            </div>
                          ) : (
                            "Tandai Selesai"
                          )}
                        </button>
                      </div>

                      {/* Step Navigation */}
                      <div className="mt-4 flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentStep(step.step_number)}
                          className={`text-sm px-3 py-1 rounded-full transition-colors ${
                            isCurrent ? "bg-blue-100 text-blue-800" : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {isCurrent ? "Langkah Saat Ini" : "Fokus ke langkah ini"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Butuh Bantuan?</h3>
          <p className="text-blue-800 mb-4">
            Jika Anda mengalami kesulitan pada salah satu langkah, jangan ragu untuk menghubungi kami untuk bantuan.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Hubungi Dukungan
            </button>
            <button className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Lihat FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalStepsPage;
