import express from 'express';
import {
  getUserStats,
  getUserHistory,
  getGlobalRanking,
} from '../controllers/stats.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Estadísticas personales del usuario autenticado
router.get('/usuarios/estadisticas', authenticateToken, getUserStats);

// Historial de partidas del usuario autenticado
router.get('/usuarios/historial', authenticateToken, getUserHistory);

// Ranking global de todos los usuarios
router.get('/ranking/global', authenticateToken, getGlobalRanking);

export default router;
