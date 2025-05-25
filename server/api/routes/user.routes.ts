import express from 'express';
import { updateProfile, deleteAccount, getProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/authMiddleware';
import { recoverPassword } from '../controllers/user.controller';
import { updatePreferences, getPreferences } from '../controllers/user.controller';

const router = express.Router();

router.put('/usuarios/modificarPerfil', authenticateToken, updateProfile);
router.delete('/usuarios', authenticateToken, deleteAccount);
router.get('/usuarios/verPerfil', authenticateToken, getProfile);
router.post('/usuarios/recover-password', recoverPassword);
router.put('/usuarios/preferences', authenticateToken, updatePreferences);
router.get('/usuarios/preferences', authenticateToken, getPreferences);


export default router;
