import { Router } from 'express';
import {
  saveGame,
  getPendingGame,
  finishGame
} from '../controllers/game.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/guardar', authenticateToken, saveGame);
router.get('/pendiente', authenticateToken, getPendingGame);
router.post('/finalizar', authenticateToken, finishGame);

export default router;
