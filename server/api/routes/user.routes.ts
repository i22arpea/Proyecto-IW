import express from 'express';
import {
  updateProfile,
  deleteAccount,
  getProfile,
  recoverPassword,
  updatePreferences,
  getPreferences,
  getUserByUsername
} from '../controllers/user.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Todas las rutas bajo /usuarios
router.put('/usuarios/modificarPerfil', authenticateToken, updateProfile);
router.delete('/usuarios', authenticateToken, deleteAccount);
router.get('/usuarios/verPerfil', authenticateToken, getProfile);
router.post('/usuarios/recover-password', recoverPassword);
router.put('/usuarios/preferences', authenticateToken, updatePreferences);
router.get('/usuarios/preferences', authenticateToken, getPreferences);
router.get('/usuarios/por-nombre/:username', getUserByUsername); // ✅ aquí estaba el fallo

export default router;
