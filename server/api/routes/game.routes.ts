import { Router } from 'express';
import {
  saveGame,
  getPendingGame,
  finishGame,
  getUserGameHistory,
  getUserGameStats
} from '../controllers/game.controller';
import { authenticateToken } from '../middleware/authMiddleware';
import { getRandomWord } from '../controllers/game.controller';


const router = Router();

router.post('/guardar', authenticateToken, saveGame);
router.get('/pendiente', authenticateToken, getPendingGame);
router.post('/finalizar', authenticateToken, finishGame);
router.get('/nueva', authenticateToken, getRandomWord);
router.get('/historial', authenticateToken, getUserGameHistory);
router.get('/estadisticas', authenticateToken, getUserGameStats);


export default router;
