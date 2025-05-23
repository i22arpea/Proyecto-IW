import express from 'express';
import { updateProfile, deleteAccount } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.put('/usuarios/perfil', authenticateToken, updateProfile);
router.delete('/usuarios', authenticateToken, deleteAccount);

export default router;
