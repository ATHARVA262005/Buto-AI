import React from 'react';
import { SUBSCRIPTION_PLANS } from '../../../Server/config/plans.js';
import { FiCheck, FiX } from 'react-icons/fi';

const PlanSelector = ({ selectedPlan, onPlanSelect, onSubmit, loading }) => {
  const plans = Object.entries(SUBSCRIPTION_PLANS);

  const renderFeatureIcon = (value) => {
    if (value.startsWith('❌')) {
      return <FiX className="w-5 h-5 text-red-500 shrink-0" />;
    }
    // Changed to always use blue for checkmarks
    return <FiCheck className="w-5 h-5 text-blue-500 shrink-0" />;
  };

  const formatFeatureText = (value) => {
    // Remove the emoji prefixes if they exist
    return value.replace(/^(❌|✅)\s*/, '');
  };

  return (
    <div className="space-y-2">
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(([key, plan]) => (
          <div
            key={key}
            onClick={() => onPlanSelect(key.toLowerCase())}
            className={`${
              selectedPlan === key.toLowerCase()
                ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500'
                : 'border-gray-700 hover:border-gray-500'
            } border-2 rounded-lg p-6 cursor-pointer transition-all duration-200`}
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {plan.name}
            </h3>
            <div className="text-2xl font-bold text-white mb-6">
              ${plan.price}<span className="text-sm text-gray-400">/month</span>
            </div>
            <ul className="space-y-4">
              {Object.entries(plan.features).map(([feature, value]) => (
                <li key={feature} className="flex items-start gap-3 text-gray-300">
                  <span className="mt-0.5">{renderFeatureIcon(value)}</span>
                  <span className="text-sm">
                    {formatFeatureText(value)}
                  </span>
                </li>
              ))}
            </ul>
            {selectedPlan === key.toLowerCase() && (
              <div className="mt-6 text-sm text-blue-400">
                Selected Plan ✓
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onSubmit}
        disabled={!selectedPlan || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
                 hover:bg-blue-700 transition-colors disabled:opacity-50
                 disabled:cursor-not-allowed focus:outline-none focus:ring-2
                 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        {loading ? 'Processing...' : 'Continue with Selected Plan'}
      </button>
    </div>
  );
};

export default PlanSelector;
