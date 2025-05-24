import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Registro de nuevo usuario
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validación básica
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de correo electrónico inválido' });
    }

    // Validar longitud mínima de la contraseña
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar token de verificación
    const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken
    });

    await newUser.save();

    // Enviar email de verificación
    const verifyUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifica tu correo - Wordle',
      html: `<p>Hola ${username},</p>
        <p>Por favor verifica tu correo haciendo clic en el siguiente enlace:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>Si no creaste esta cuenta, ignora este correo.</p>`
    });

    return res.status(201).json({ message: 'Usuario registrado. Revisa tu correo para verificar la cuenta.' });
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    return res.status(500).json({ error: 'Fallo en el registro', details: error.message });
  }
};


/**
 * Login de usuario
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Debes verificar tu correo antes de iniciar sesión.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ error: 'Fallo en el inicio de sesión' });
  }
};

//logout de usuario

export const logout = async (_req: Request, res: Response) => {
  // Aquí simplemente devolvemos un mensaje porque el token se gestiona en el frontend
  return res.status(200).json({ message: 'Sesión cerrada correctamente.' });
};

/**
 * Verificación de correo electrónico
 */
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token faltante.' });
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado.' });
    if (user.isVerified) {
      return res.status(200).json({ message: 'Este correo ya ha sido verificado.' });
    }
    if (user.verificationToken !== token) {
      return res.status(400).json({ error: 'Token inválido o expirado.' });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return res.json({ message: 'Correo verificado correctamente. Ya puedes iniciar sesión.' });
  } catch (error) {
    return res.status(400).json({ error: 'Token inválido o expirado.' });
  }
};
