import User from '../models/user.model.js';
import Subscription from '../models/subscription.model.js';
import { sendOTPEmail } from '../services/email.service.js';
import { createSubscription } from '../services/subscription.service.js';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.config.js';
import bcrypt from 'bcrypt';
import redisClient from '../services/redis.service.js';

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Create user with inactive subscription
        const user = new User({ 
            email, 
            password: await User.hashPassword(password),
            emailVerified: false
        });
        await user.save();

        // Create subscription record (inactive)
        const subscription = new Subscription({
            userId: user._id,
            plan: 'free',
            status: 'inactive',
            endDate: new Date(Date.now() + 30*24*60*60*1000) // 30 days from now
        });
        await subscription.save();

        // Link subscription to user
        user.subscription = subscription._id;
        await user.save();

        // Generate and store plain OTP
        const otp = generateOTP();
        user.otp = {
            code: otp.toString(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        };
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.status(201).json({
            success: true,
            message: 'Account created. Please verify your email.',
            userId: user._id
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { userId, otp, email } = req.body;
        console.log('Verification attempt:', { userId, email, otp });

        if (!userId || !otp || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const user = await User.findOne({ 
            _id: userId,
            email: email
        });

        if (!user) {
            console.log('User not found:', { userId, email });
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('Stored user OTP:', user.otp);
        const isValid = user.verifyOTP(otp);
        console.log('OTP validation result:', isValid);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Update user verification status
        user.isVerified = true;
        user.emailVerified = true;
        user.otp = undefined;
        await user.save();

        console.log('User verified successfully:', userId);

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error('Verification error details:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during verification',
            error: error.message
        });
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        const otp = user.generateOTP();
        await user.save();
        
        // Send OTP email
        await sendOTPEmail(email, otp);

        res.json({ 
            success: true,
            message: 'New OTP sent successfully' 
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to resend OTP',
            error: error.message
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { userId, otp, email } = req.body;

        if (!userId || !otp || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const user = await User.findOne({ 
            _id: userId,
            email: email,
            emailVerificationCode: otp,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Update user verification status
        user.isEmailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error('Email verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during email verification'
        });
    }
};

export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        const verificationToken = user.generateVerificationToken();
        user.verificationToken = verificationToken;
        await user.save();

        await sendVerificationEmail(email, verificationToken);

        res.json({ message: 'Verification email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
            .select('+password')
            .populate('subscription');

        if (!user || !await user.validatePassword(password)) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            JWT_CONFIG.secret,
            { expiresIn: '24h' }
        );

        // Set cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        };

        // Set HTTP-only cookies
        res.cookie('token', token, cookieOptions);
        res.cookie('userId', user._id.toString(), {
            ...cookieOptions,
            httpOnly: false // Allow JavaScript access to userId
        });

        // Return user data without sensitive information
        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                emailVerified: user.emailVerified,
                subscription: user.subscription
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Login failed' 
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('subscription');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                emailVerified: user.emailVerified || false,
                subscription: user.subscription,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        // Add token to blacklist in Redis
        await redisClient.set(`bl_${token}`, 'true', 'EX', 24 * 60 * 60);
        // Clear the cookies
        res.clearCookie('token', JWT_CONFIG.cookie);
        res.clearCookie('userId', JWT_CONFIG.cookie);
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = user.generateOTP();
        await user.save();
        await sendOTPEmail(email, otp);

        res.json({ 
            success: true,
            message: 'Password reset OTP sent to your email',
            email: email // Send back email for next step
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email }).select('+otp.hashedCode +otp.expiresAt');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValid = await user.verifyOTP(otp);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Generate a temporary token for password reset
        const resetToken = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_CONFIG.secret,
            { expiresIn: '15m' }
        );

        res.json({ 
            success: true,
            resetToken,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        
        if (!resetToken || !newPassword) {
            return res.status(400).json({ 
                message: 'Reset token and new password are required' 
            });
        }

        const decoded = jwt.verify(resetToken, JWT_CONFIG.secret);
        
        const user = await User.findOne({ 
            _id: decoded.userId,
            email: decoded.email 
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = await User.hashPassword(newPassword);
        user.otp = undefined; // Clear OTP data
        await user.save();

        res.json({ 
            success: true,
            message: 'Password reset successful' 
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(401).json({ 
            success: false,
            message: 'Invalid or expired reset token' 
        });
    }
};

// Utility function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
