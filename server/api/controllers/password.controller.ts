import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Configura el transporte de nodemailer (ajusta con tus credenciales reales)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'El correo es obligatorio.' });

  const user = await User.findOne({ email });
  if (!user) {
    // Por seguridad, no revelar si el email existe o no
    return res.json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
  }

  // Generar token de recuperación válido por 1 hora
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  // Enviar email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña - Wordle',
      html: `<p>Hola ${user.username},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Si no solicitaste este cambio, ignora este correo.</p>`
    });
    return res.json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
  } catch (error) {
    console.error('Error enviando email de recuperación:', error);
    return res.status(500).json({ error: 'No se pudo enviar el correo de recuperación.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Faltan datos.' });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return res.json({ message: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    return res.status(400).json({ error: 'Token inválido o expirado.' });
  }
};
