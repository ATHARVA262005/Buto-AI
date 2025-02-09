import User from '../models/user.model.js';
import { sendEmailChangeOTP, verifyEmailChangeOTP } from '../services/emailChange.service.js';
import bcrypt from 'bcrypt';

export const initiateEmailChange = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const userId = req.user._id;

        // Check if email is already in use
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }

        // Send OTP to new email
        const sent = await sendEmailChangeOTP(userId, newEmail);
        if (!sent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email'
            });
        }

        res.json({
            success: true,
            message: 'Verification code sent to new email'
        });
    } catch (error) {
        console.error('Email change initiation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during email change initiation'
        });
    }
};

export const verifyEmailChange = async (req, res) => {
    try {
        const { otp } = req.body;
        const userId = req.user._id;

        const result = await verifyEmailChangeOTP(userId, otp);
        
        if (!result.valid) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        // Update user's email
        await User.findByIdAndUpdate(userId, { 
            email: result.newEmail,
            emailVerified: true
        });

        res.json({
            success: true,
            message: 'Email changed successfully',
            newEmail: result.newEmail
        });
    } catch (error) {
        console.error('Email change verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during email change verification'
        });
    }
};

export const verifyPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user._id;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }

        const user = await User.findById(userId).select('+password');
        if (!user || !user.password) {
            return res.status(400).json({
                success: false,
                message: 'User data incomplete'
            });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        res.json({
            success: true,
            message: 'Password verified'
        });
    } catch (error) {
        console.error('Password verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password verification'
        });
    }
};
