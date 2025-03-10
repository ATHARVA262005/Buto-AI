import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.config.js';
import User from '../models/user.model.js';
import redisClient from '../services/redis.service.js';
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        // Check if token is blacklisted
        const isBlacklisted = await redisClient.get(`bl_${token}`);
        if (isBlacklisted) {
            res.clearCookie('token');
            return res.status(401).json({
                success: false,
                message: 'Token has been invalidated'
            });
        }

        const decoded = jwt.verify(token, JWT_CONFIG.secret);
        const user = await User.findById(decoded.userId);

        if (!user) {
            res.clearCookie('token');
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export const authPayment = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_CONFIG.secret);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Just set the user and continue - removed userId check
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Add aliases for backward compatibility
export const authUser = authMiddleware;
export const authenticateToken = authMiddleware;