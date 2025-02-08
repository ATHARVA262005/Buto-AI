import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { toast } from 'react-hot-toast';
import { FiMail } from 'react-icons/fi';

function VerifyEmail() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const verifyOTP = async () => {
        if (!email) return;
        setLoading(true);
        
        try {
            await axios.post('/auth/verify-otp', {
                email,
                otp: otp.join('')
            });
            
            toast.success('Email verified successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        if (!email) return;
        
        try {
            await axios.post('/auth/resend-otp', { email });
            toast.success('New OTP sent successfully!');
            setOtp(['', '', '', '', '', '']);
        } catch (error) {
            toast.error('Failed to resend OTP');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
                <div className="text-center">
                    <FiMail className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
                    <p className="text-gray-400 mb-6">
                        Enter the 6-digit code sent to your email
                    </p>

                    <div className="flex justify-center gap-2 mb-6">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                className="w-12 h-12 text-center text-xl font-bold text-white bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>

                    <button
                        onClick={verifyOTP}
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 mb-4"
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <button
                        onClick={resendOTP}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;