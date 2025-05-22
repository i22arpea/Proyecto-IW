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

// API Routes
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
      '/register',
      '/login',
      '/protected'
    ],
  });
});


// Only export the app, do NOT start the server here
export default app;