import express from 'express';
import { updateProfile, deleteAccount } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/authMiddleware';
import { recoverPassword } from '../controllers/user.controller';

const router = express.Router();

router.put('/usuarios/perfil', authenticateToken, updateProfile);
router.delete('/usuarios', authenticateToken, deleteAccount);
router.post('/usuarios/recover-password', recoverPassword);


export default router;
