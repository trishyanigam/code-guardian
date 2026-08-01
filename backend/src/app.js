import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import config from './config/env.config.js';
import passport from './config/passport.js';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/index.js';

const app = express();

// 1. Enable CORS with credentials and configurable origins
const allowedOrigins = [config.clientUrl, config.cors.origin].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// 2. Enable HTTP request logging with Morgan
app.use(morgan('dev'));

// 3. Enable JSON body parsing
app.use(express.json());

// 4. Enable URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));

// 5. Enable Cookie Parser
app.use(cookieParser());

// 6. Initialize Passport Middleware
app.use(passport.initialize());

// Base health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CodeGuardian AI API',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// 7. Mount all API routes under /api/v1
app.use('/api/v1', routes);

// 8. 404 Not Found Middleware
app.use(notFoundHandler);

// 9. Centralized Global Error Handler Middleware
app.use(errorHandler);

export default app;
