import React, { useState } from 'react';
import { FiX, FiSettings, FiMail, FiLock, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ProfileModal = ({ isOpen, onClose, user, onLogout }) => {
  if (!isOpen) return null;

  const [activeMenu, setActiveMenu] = useState('General');
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const menuItems = [
    { icon: FiSettings, label: 'General', action: () => setActiveMenu('General') },
    { icon: FiMail, label: 'Change Email', action: () => setActiveMenu('Change Email') },
    { icon: FiLock, label: 'Change Password', action: () => setActiveMenu('Change Password') },
    { 
      icon: FiLogOut, 
      label: 'Logout', 
      action: onLogout, 
      className: 'text-red-500 hover:text-red-400' 
    }
  ];

  const handleInitiateEmailChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/email-change/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ newEmail })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsOtpSent(true);
        setMessage('Verification code sent to your new email');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to initiate email change');
    }
  };

  const handleVerifyEmailChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/email-change/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ otp })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Email changed successfully');
        setIsOtpSent(false);
        setNewEmail('');
        setOtp('');
        // Refresh user data or update context
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to verify email change');
    }
  };

  const handlePasswordVerification = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/email-change/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password: currentPassword })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsPasswordVerified(true);
        setCurrentPassword('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to verify password');
    }
  };

  const renderPasswordVerification = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-300 mb-4">Verify Your Password</h3>
      <form onSubmit={handlePasswordVerification} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Verify Password
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );

  const renderEmailChangeForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-300 mb-4">Change Email Address</h3>
      {!isOtpSent ? (
        <form onSubmit={handleInitiateEmailChange} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Email Address</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Send Verification Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyEmailChange} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Enter Verification Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Verify Code
          </button>
        </form>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'Change Email':
        return isPasswordVerified ? renderEmailChangeForm() : renderPasswordVerification();
      case 'General':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">General Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400">Email</label>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Subscription Status</label>
                  <p className="text-white capitalize">{user?.subscription?.status || 'No active subscription'}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Current Plan</label>
                  <p className="text-white capitalize">{user?.subscription?.plan || 'Free'}</p>
                </div>
              </div>
            </div>

            <div>
              <Link
                to="/subscription"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Upgrade Subscription
              </Link>
            </div>
          </div>
        );
      // ...other cases...
    }
  };

  const handleMenuClick = (item) => {
    setActiveMenu(item.label);
    if (item.label !== 'Change Email') {
      setIsPasswordVerified(false);
    }
    item.action();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Menu Items */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-700">
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left 
                        transition-colors ${
                          activeMenu === item.label 
                            ? 'bg-gray-700 text-white' 
                            : `hover:bg-gray-700 ${item.className || 'text-gray-300'}`
                        }`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Column - User Info */}
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
