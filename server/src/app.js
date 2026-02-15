import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import workflowRoutes from './routes/workflowRoutes.js';
import runRoutes from './routes/runRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './utils/errorHandler.js';


const app = express();

// Trust proxy for secure cookies and rate limiting in production
app.set('trust proxy', 1);


// Security headers
app.use(helmet());

// Rate limiting (basic, can be tuned)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (origin === allowedOrigin || origin.startsWith('http://localhost')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/workflows', workflowRoutes);
app.use('/api/runs', runRoutes); // Only mount here for run endpoints
app.use('/api/health', healthRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    // Hide stack traces in production
    const isProd = process.env.NODE_ENV === 'production';
    const status = err.statusCode || 500;
    const response = {
        success: false,
        error: err.message || 'Internal server error',
    };
    if (!isProd && err.stack) {
        response.stack = err.stack;
    }
    res.status(status).json(response);
});


// Start server
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
    console.log(`Workflow Builder Lite server running on port ${PORT} [${NODE_ENV}]`);
});

export default app;
