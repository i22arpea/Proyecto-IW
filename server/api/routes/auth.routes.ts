import express from 'express';
import { register, login } from '../controllers/auth.controller';
import { logout } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

export default router;
