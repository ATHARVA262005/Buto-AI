import { sendOTPEmail } from './email.service.js';
import redisClient from './redis.service.js';

const EMAIL_CHANGE_PREFIX = 'email_change_';
const OTP_EXPIRY = 600; // 10 minutes in seconds

export const sendEmailChangeOTP = async (userId, newEmail) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with user ID and new email in Redis
    await redisClient.setex(
        `${EMAIL_CHANGE_PREFIX}${userId}`,
        OTP_EXPIRY,
        JSON.stringify({ otp, newEmail })
    );

    // Send OTP email
    return await sendOTPEmail(newEmail, otp);
};

export const verifyEmailChangeOTP = async (userId, otp) => {
    const key = `${EMAIL_CHANGE_PREFIX}${userId}`;
    const storedData = await redisClient.get(key);
    
    if (!storedData) {
        return { valid: false, message: 'OTP expired or not found' };
    }

    const { otp: storedOTP, newEmail } = JSON.parse(storedData);
    
    if (otp !== storedOTP) {
        return { valid: false, message: 'Invalid OTP' };
    }

    // Delete the OTP after successful verification
    await redisClient.del(key);
    
    return { valid: true, newEmail };
};
