import { Router } from 'express';
import {
  checkWord,
  getDailyWord,
  getNewWord,
  getPing,
  getRandom,
  setDailyWord,
  registerUser,
  loginUser,
} from '../controllers/server.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/ping', getPing);
router.get('/api/wordle', getDailyWord);
router.get('/api/wordle/checkword/:word', checkWord);
router.get('/api/wordle/updateword', getNewWord);
router.get('/api/wordle/setword/:word', setDailyWord);
router.get('/api/wordle/random', getRandom);

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

export default router;