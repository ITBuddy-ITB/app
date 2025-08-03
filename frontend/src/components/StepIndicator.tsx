import React from "react";
import { Link, useLocation } from "react-router";

const steps = [
  { step: 1, label: "Business Profile", path: "/business/step-1" },
  { step: 2, label: "Legals", path: "/business/step-2" },
  { step: 3, label: "Financial Report", path: "/business/step-3" },
  { step: 4, label: "Projection", path: "/business/step-4" },
];

const StepIndicator: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex justify-center space-x-6 mb-8">
      {steps.map((s, index) => {
        const isActive = location.pathname === s.path;
        return (
          <Link
            key={s.step}
            to={s.path}
            className={`flex items-center space-x-2 ${isActive ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                isActive ? "border-blue-600 bg-blue-100" : "border-gray-300 bg-gray-100"
              }`}>
              {s.step}
            </div>
            <span>{s.label}</span>
            {index < steps.length - 1 && <span className="text-gray-300 mx-2">→</span>}
          </Link>
        );
      })}
    </div>
  );
};

export default StepIndicator;
