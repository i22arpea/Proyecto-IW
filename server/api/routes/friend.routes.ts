import { Router } from 'express';
import {
  sendFriendRequest,
  respondToFriendRequest,
  getFriendList,
  getFriendsRanking,
  getReceivedFriendRequests,
  getPendingFriendRequests
} from '../controllers/friend.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/solicitar', authenticateToken, sendFriendRequest);
router.post('/responder', authenticateToken, respondToFriendRequest);

// ✅ Usamos rutas diferentes
router.get('/solicitudes-recibidas', authenticateToken, getReceivedFriendRequests);
router.get('/solicitudes-pendientes', authenticateToken, getPendingFriendRequests);

router.get('/', authenticateToken, getFriendList);
router.get('/ranking', authenticateToken, getFriendsRanking);

export default router;
