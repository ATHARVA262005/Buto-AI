import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

const ErrorDisplay = ({ error, onClose }) => {
    if (!error) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-md z-[100]">
            <div className="bg-red-900/90 border border-red-500 text-red-100 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <FiAlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
                        <span className="block text-sm font-medium">{error}</span>
                    </div>
                    {onClose && (
                        <button 
                            onClick={onClose}
                            className="p-1 hover:bg-red-800/50 rounded-full transition-colors"
                        >
                            <FiX className="h-5 w-5 text-red-300" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;
