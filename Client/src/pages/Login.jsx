import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiAlertCircle, FiX } from 'react-icons/fi';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import PasswordInput from '../components/PasswordInput';
import ErrorDisplay from '../components/ErrorDisplay';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/auth/login', { email, password });
            if (response.data.success) {
                const { token, user } = response.data;
                await login(user, token);
                // If email is not verified, force redirection to verify-email page
                if (!user.emailVerified) {
                    toast.info('Please verify your email to proceed.');
                    navigate('/verify-email', { replace: true });
                    return;
                }
                // Use backend /status route to check subscription status
                const statusResponse = await axios.get('/subscription/status');
                const { status } = statusResponse.data;
                if (status === 'active') {
                    navigate('/', { replace: true });
                } else {
                    navigate('/subscription', { replace: true });
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 relative flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>
            
            <div className="bg-gray-800 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-800 relative z-10">
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Please login to continue</p>
                </div>
                <div className="space-y-6">
                    {error && (
                        <div className="bg-red-900/90 border border-red-500 text-red-100 px-4 py-3 rounded-lg">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <FiAlertCircle className="w-5 h-5 text-red-300" />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                                <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSubmit(e);
                                }}
                                className="pl-10 w-full rounded-lg bg-[#1A1A1A] border border-gray-800 text-white px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-600"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Password
                        </label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSubmit(e);
                            }}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <Link 
                            to="/forgot-password" 
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold border border-gray-800 hover:bg-[#222222] transition-all duration-300 relative overflow-hidden group disabled:opacity-50"
                    >
                        <span className="relative z-10">{loading ? 'Logging in...' : 'Login'}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
                <p className="mt-6 text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;