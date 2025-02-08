import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiX } from 'react-icons/fi';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';
import PasswordInput from '../components/PasswordInput';
import { toast } from 'react-toastify';
import ErrorDisplay from '../components/ErrorDisplay';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        isStrong: false,
        message: ''
    });
    const [error, setError] = useState(null);
    
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const getPasswordStrengthColor = () => {
        const { score } = passwordStrength;
        if (score < 2) return 'bg-red-500';
        if (score < 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!passwordStrength.isStrong) {
            toast.error('Please ensure your password meets all requirements');
            setError('Please ensure your password meets all requirements');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('/auth/signup', {
                email: formData.email,
                password: formData.password
            });
            
            if (response.data.success) {
                toast.success('Registration successful! Please verify your email.');
                navigate('/verify-email', { 
                    state: { email: formData.email },
                    replace: true
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
            setError(errorMessage);
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen bg-gray-900 relative flex items-center justify-center p-4 overflow-hidden">
      {error && <ErrorDisplay error={error} onClose={() => setError(null)} />}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="bg-gray-800 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-800 relative z-10">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join us today!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg bg-white/10 border border-white/30 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-1">
              Password
            </label>
            <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            {formData.password && (
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
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200 mb-1">
              Confirm Password
            </label>
            <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                Passwords do not match
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !passwordStrength.isStrong || formData.password !== formData.confirmPassword}
            className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold border border-gray-800 hover:bg-[#222222] transition-all duration-300 relative overflow-hidden group disabled:opacity-50"
          >
            <span className="relative z-10">{loading ? 'Registering...' : 'Register'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;