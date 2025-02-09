import React from 'react';
import { FiCheck, FiCreditCard } from 'react-icons/fi';

const PaymentConfirmation = ({ payment, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <FiCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">
                        Payment Successful!
                    </h3>
                    <div className="text-gray-400 mb-4">
                        Your subscription has been activated successfully.
                    </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Amount paid:</span>
                        <span className="text-white font-medium">${payment.amount}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Payment ID:</span>
                        <span className="text-gray-400 text-sm">{payment.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Card used:</span>
                        <div className="flex items-center">
                            <FiCreditCard className="text-gray-400 mr-2" />
                            <span className="text-gray-400">
                                {payment.card.brand.toUpperCase()} ****{payment.card.last4}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

// Add default export
export default PaymentConfirmation;
