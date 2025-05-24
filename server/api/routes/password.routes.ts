import { Router } from 'express';
import { forgotPassword, resetPassword } from '../controllers/password.controller';

const router = Router();

// POST /api/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/reset-password
router.post('/reset-password', resetPassword);

export default router;
