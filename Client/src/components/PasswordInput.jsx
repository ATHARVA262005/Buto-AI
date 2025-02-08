import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const PasswordInput = ({ 
    value, 
    onChange, 
    placeholder = "Enter password", 
    className = "",
    ...props 
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                className={`pl-10 pr-10 w-full rounded-lg bg-[#1A1A1A] border border-gray-800 
                    text-white px-4 py-3 focus:outline-none focus:border-blue-500/50 
                    focus:ring-1 focus:ring-blue-500/50 transition-all 
                    placeholder-gray-600 ${className}`}
                placeholder={placeholder}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                    hover:text-gray-300 focus:outline-none"
            >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
        </div>
    );
};

export default PasswordInput;
