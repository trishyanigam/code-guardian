import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/index.js';

const app = express();

// Enable CORS
app.use(cors());

// Enable HTTP request logging with Morgan
app.use(morgan('dev'));

// Enable JSON body parsing
app.use(express.json());

// Enable URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CodeGuardian AI API',
    status: 'online',
  });
});

// Mount all APIs under /api/v1
app.use('/api/v1', routes);

// 404 Not Found Middleware
app.use(notFoundHandler);

// Centralized Error Handler Middleware
app.use(errorHandler);

export default app;
