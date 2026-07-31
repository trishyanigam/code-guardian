import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Asynchronously initialize database connection and start Express server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start listening for incoming HTTP requests
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`💥 Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
