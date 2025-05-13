// This file is responsible for setting up the Express server and connecting to the database.
// It imports necessary modules, configures middleware, and defines routes for the server.
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import connectDB from './db/index';
import Routes from './routes/server.routes';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(Routes);

// Default route
app.get('*', (req, res) => {
  res.status(200).json({
    Routes: [
      '/api/wordle',
      '/api/wordle/checkword/:word',
      '/api/wordle/updateword',
      '/api/wordle/setword/:word',
      '/api/wordle/random',
    ],
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});