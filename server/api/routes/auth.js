const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'palabraSecretaSegura'; // Cambia esto por algo más seguro en producción

// Registro
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    try {
        const user = new User({ username, email, password: hashed });
        await user.save();
        res.status(201).json({ message: 'Usuario creado' });
    } catch (err) {
        res.status(400).json({ error: 'Error al registrar usuario' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2d' });
    res.json({ token });
});

// Ruta protegida
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Sin token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
});

module.exports = router;