import React from "react";
import { useNavigate } from "react-router-dom";

interface Step {
  step_number: number;
  description: string;
  redirect_url: string;
}

interface RequiredLegal {
  type: string;
  has_legal: boolean;
  notes?: string;
  steps?: Step[];
}

interface ProductLegal {
  product_name: string;
  required: RequiredLegal[];
}

interface LegalComparison {
  required: RequiredLegal[];
  products: ProductLegal[];
}

interface Props {
  comparison: LegalComparison;
}

const LegalRequirements: React.FC<Props> = ({ comparison }) => {
  const navigate = useNavigate();

  const handleLegalClick = (legal: RequiredLegal) => {
    if (!legal.has_legal && legal.steps?.length) {
      navigate(`/legal/steps/${legal.type}`, { state: { steps: legal.steps } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Business Legals</h3>
        <div className="space-y-4">
          {comparison.required.map((legal) => (
            <div
              key={legal.type}
              onClick={() => handleLegalClick(legal)}
              className={`p-4 rounded-lg border ${
                legal.has_legal ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50 cursor-pointer hover:bg-red-100"
              }`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{legal.type}</span>
                {legal.has_legal ? (
                  <span className="text-green-600">✓ Completed</span>
                ) : (
                  <span className="text-red-600">Missing</span>
                )}
              </div>
              {legal.notes && <p className="text-sm text-gray-600 mt-2">{legal.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {comparison.products.map((product) => (
        <div key={product.product_name} className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Legals for {product.product_name}</h3>
          <div className="space-y-4">
            {product.required.map((legal) => (
              <div
                key={legal.type}
                onClick={() => handleLegalClick(legal)}
                className={`p-4 rounded-lg border ${
                  legal.has_legal ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50 cursor-pointer hover:bg-red-100"
                }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{legal.type}</span>
                  {legal.has_legal ? (
                    <span className="text-green-600">✓ Completed</span>
                  ) : (
                    <span className="text-red-600">Missing</span>
                  )}
                </div>
                {legal.notes && <p className="text-sm text-gray-600 mt-2">{legal.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LegalRequirements;
