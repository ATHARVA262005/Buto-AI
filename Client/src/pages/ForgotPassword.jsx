import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import axios from '../config/axios';
import PasswordInput from '../components/PasswordInput';
import { toast } from 'react-toastify';
import ErrorDisplay from '../components/ErrorDisplay';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const navigate = useNavigate();
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        isStrong: false,
        message: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkPasswordStrength = (password) => {
        let score = 0;
        let message = [];

        // Length check
        if (password.length >= 8) score++;
        else message.push("At least 8 characters");

        // Uppercase check
        if (/[A-Z]/.test(password)) score++;
        else message.push("One uppercase letter");

        // Lowercase check
        if (/[a-z]/.test(password)) score++;
        else message.push("One lowercase letter");

        // Number check
        if (/\d/.test(password)) score++;
        else message.push("One number");

        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        else message.push("One special character");

        return {
            score,
            isStrong: score >= 4,
            message: message.join(' • ')
        };
    };

    const getPasswordStrengthColor = () => {
        const { score } = passwordStrength;
        if (score < 2) return 'bg-red-500';
        if (score < 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setNewPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleSendOTP = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('/auth/forgot-password', { email });
            if (response.data.success) {
                setStep(2);
                toast.success('OTP sent successfully!');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error sending OTP');
            console.error('Send OTP error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Add this to prevent event bubbling

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('/auth/verify-reset-otp', { email, otp });
            if (response.data.success) {
                setResetToken(response.data.resetToken);
                setStep(3);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid OTP');
            console.error('Verify OTP error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Add this to prevent event bubbling

        if (!newPassword) {
            return;
        }
        
        if (!passwordStrength.isStrong) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('/auth/reset-password', { 
                resetToken, 
                newPassword 
            });
            
            if (response.data.success) {
                navigate('/login', { replace: true });
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Unable to reset password');
            console.error('Reset password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            {error && <ErrorDisplay error={error} onClose={() => setError(null)} />}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                    {step === 1 && "Reset Password"}
                    {step === 2 && "Verify OTP"}
                    {step === 3 && "New Password"}
                </h2>

                <div className="space-y-4">
                    {error && <ErrorDisplay error={error} onClose={() => setError(null)} />}
                    {step === 1 && (
                        <div>
                            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                                <div>
                                    <label className="text-gray-300 mb-2 block">Email Address</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 p-3 bg-gray-700 text-white rounded-lg"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={handleSendOTP}
                                    className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                                >
                                    Send OTP
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div>
                                <label className="text-gray-300 mb-2 block">Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg"
                                    placeholder="Enter 6-digit OTP"
                                    required
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={handleVerifyOTP}
                                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                            >
                                Verify OTP
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div>
                                <label className="text-gray-300 mb-2 block">New Password</label>
                                <PasswordInput
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                    required
                                />
                                {newPassword && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1,2,3,4,5].map((index) => (
                                                <div 
                                                    key={index}
                                                    className={`h-1 flex-1 rounded-full ${
                                                        index <= passwordStrength.score ? getPasswordStrengthColor() : 'bg-gray-600'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {passwordStrength.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <button 
                                type="button"
                                onClick={handleResetPassword}
                                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!passwordStrength.isStrong}
                            >
                                Reset Password
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;