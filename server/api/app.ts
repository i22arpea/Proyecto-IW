import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import connectDB from './db/index';
import Routes from './routes/server.routes';
import userRoutes from './routes/user.routes';
import statsRoutes from './routes/stats.routes';
import authRoutes from './routes/auth.routes';
import friendRoutes from './routes/friend.routes';
import gameRoutes from './routes/game.routes';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use(Routes);
app.use('/api', userRoutes);
app.use('/api', statsRoutes);
app.use('/api', authRoutes);
app.use('/api/amigos', friendRoutes);
app.use('/api/partidas', gameRoutes);


// Hay que acutalizar las rutas
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

export default app;
