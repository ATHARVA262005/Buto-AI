import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const verifyCurrentPassword = async (req, res) => {
    try {
        const { currentPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password is required'
            });
        }

        const user = await User.findById(userId).select('+password');
        if (!user || !user.password) {
            return res.status(400).json({
                success: false,
                message: 'User data incomplete'
            });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        res.json({
            success: true,
            message: 'Current password verified'
        });
    } catch (error) {
        console.error('Password verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password verification'
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Both current and new passwords are required'
            });
        }

        // Password validation
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
        }

        const user = await User.findById(userId).select('+password');
        
        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        await User.findByIdAndUpdate(userId, { 
            password: hashedPassword
        });

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password change'
        });
    }
};
