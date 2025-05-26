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
import passwordRoutes from './routes/password.routes';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use(Routes);
app.use('/Proyecto-IW/api', userRoutes);
app.use('/Proyecto-IW/api', statsRoutes);
app.use('/Proyecto-IW/api', authRoutes);
app.use('/Proyecto-IW/api/amigos', friendRoutes);
app.use('/Proyecto-IW/api/partidas', gameRoutes);
app.use('/Proyecto-IW/api', passwordRoutes);

// Hay que acutalizar las rutas
app.get('*', (req, res) => {
  res.status(200).json({
    Routes: [
      '/Proyecto-IW/api/wordle',
      '/Proyecto-IW/api/wordle/checkword/:word',
      '/Proyecto-IW/api/wordle/updateword',
      '/Proyecto-IW/api/wordle/setword/:word',
      '/Proyecto-IW/api/wordle/random',
      '/Proyecto-IW/api/register',
      '/Proyecto-IW/api/login',
      '/Proyecto-IW/api/protected'
    ],
  });
});

export default app;
