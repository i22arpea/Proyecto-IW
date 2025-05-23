import { Router } from 'express';
import {
  sendFriendRequest,
  respondToFriendRequest,
  getFriendList,
  getFriendsRanking
} from '../controllers/friend.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/solicitar', authenticateToken, sendFriendRequest);
router.post('/responder', authenticateToken, respondToFriendRequest);
router.get('/', authenticateToken, getFriendList);
router.get('/ranking', authenticateToken, getFriendsRanking);

export default router;