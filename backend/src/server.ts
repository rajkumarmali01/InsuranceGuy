import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import contactRoutes from './routes/contactRoutes';
import policyRoutes from './routes/policyRoutes';
import adminRoutes from './routes/adminRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static('uploads'));

// Root route is handled conditionally below

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../../frontend', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('Insurance Guy API is running');
    });
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Connect to DB and Start Server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
