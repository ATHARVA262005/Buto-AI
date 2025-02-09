import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRotes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import aiRoutes from './routes/ai.routes.js';
import messageRoutes from './routes/message.routes.js';
import authRoutes from './routes/auth.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import cookieParser from 'cookie-parser';
import { checkSubscriptionLimits } from './middleware/subscription.middleware.js';
import cors from 'cors';

connect();
const app = express();

// Update CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1); // trust first proxy for secure cookies

// Auth routes should be before subscription middleware
app.use('/api/auth', authRoutes);

// Add subscription checks for other routes
app.use('/api/users', checkSubscriptionLimits, userRotes);
app.use('/api/projects', checkSubscriptionLimits, projectRoutes);
app.use('/api/ai', checkSubscriptionLimits, aiRoutes);
app.use('/api/messages', checkSubscriptionLimits, messageRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Remove this line since we're applying middleware per route
// app.use('/api', checkSubscriptionLimits);

app.get('/test', (req, res) => {
    res.send('testing successfull');
});

export default app;
