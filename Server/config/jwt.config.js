export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    options: {
        expiresIn: '24h'
    },
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
    }
};
