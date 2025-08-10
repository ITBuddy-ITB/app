import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LegalComparison, RequiredLegal } from "../../services/businessService";

interface Props {
  comparison: LegalComparison;
  isProductLegalPage: boolean;
}

const LegalRequirements: React.FC<Props> = ({ comparison, isProductLegalPage }) => {
  const navigate = useNavigate();
  const [isBusinessLegalExpanded, setIsBusinessLegalExpanded] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  const handleLegalClick = (legal: RequiredLegal) => {
    if (!legal.has_legal && legal.steps?.length) {
      // Encode the legal type untuk URL dan pass data melalui state
      const encodedType = encodeURIComponent(legal.type);
      navigate(`/legal/steps/${encodedType}`, {
        state: {
          steps: legal.steps,
          type: legal.type,
        },
      });
    }
  };

  const toggleBusinessLegal = () => {
    setIsBusinessLegalExpanded(!isBusinessLegalExpanded);
  };

  const toggleProduct = (productName: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productName]: !prev[productName],
    }));
  };

  // Function to count missing legals
  const getMissingCount = (legals?: RequiredLegal[] | null) => {
    return Array.isArray(legals) ? legals.filter((legal) => !legal.has_legal).length : 0;
  };
  const getCompletedCount = (legals?: RequiredLegal[] | null) => {
    return Array.isArray(legals) ? legals.filter((legal) => legal.has_legal).length : 0;
  };

  return (
    <div className="space-y-6">
      {!isProductLegalPage && comparison?.required && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between cursor-pointer" onClick={toggleBusinessLegal}>
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-800">Required Business Legals</h3>
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {getCompletedCount(comparison.required)} Completed
                </span>
                {getMissingCount(comparison.required) > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {getMissingCount(comparison.required)} Missing
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isBusinessLegalExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {isBusinessLegalExpanded && Array.isArray(comparison?.required) && (
            <div className="mt-4 space-y-4">
              {comparison.required.map((legal) => (
                <div
                  key={legal.type}
                  onClick={() => handleLegalClick(legal)}
                  className={`p-4 rounded-lg border transition-colors duration-200 ${
                    legal.has_legal ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50 cursor-pointer hover:bg-red-100"
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{legal.type}</span>
                    {legal.has_legal ? (
                      <span className="text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Completed
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Missing
                      </span>
                    )}
                  </div>
                  {legal.notes && <p className="text-sm text-gray-600 mt-2">{legal.notes}</p>}
                  {!legal.has_legal && legal.steps && legal.steps.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      Click to see {legal.steps.length} step{legal.steps.length > 1 ? "s" : ""} to complete
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isProductLegalPage &&
        Array.isArray(comparison?.products) &&
        comparison?.products.map((product) => (
          <div key={product.product_name} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleProduct(product.product_name)}>
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-800">Required Legals for {product.product_name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {getCompletedCount(product.required)} Completed
                  </span>
                  {getMissingCount(product.required) > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {getMissingCount(product.required)} Missing
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    expandedProducts[product.product_name] ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {expandedProducts[product.product_name] && Array.isArray(product.required) && (
              <div className="mt-4 space-y-4">
                {product.required.map((legal) => (
                  <div
                    key={legal.type}
                    onClick={() => handleLegalClick(legal)}
                    className={`p-4 rounded-lg border transition-colors duration-200 ${
                      legal.has_legal
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50 cursor-pointer hover:bg-red-100"
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{legal.type}</span>
                      {legal.has_legal ? (
                        <span className="text-green-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Completed
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Missing
                        </span>
                      )}
                    </div>
                    {legal.notes && <p className="text-sm text-gray-600 mt-2">{legal.notes}</p>}
                    {!legal.has_legal && legal.steps && legal.steps.length > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        Click to see {legal.steps.length} step{legal.steps.length > 1 ? "s" : ""} to complete
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default LegalRequirements;
