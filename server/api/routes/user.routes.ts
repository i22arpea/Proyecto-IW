import express from 'express';
import { updateProfile, deleteAccount, getProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.put('/usuarios/modificarPerfil', authenticateToken, updateProfile);
router.delete('/usuarios', authenticateToken, deleteAccount);
router.get('/usuarios/verPerfil', authenticateToken, getProfile);

export default router;
