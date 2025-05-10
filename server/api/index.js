require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Conectar a MongoDB utilizando la URI del archivo .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((err) => {
    console.error('Error de conexión a MongoDB:', err);
  });

app.use(cors());
app.use(express.json());

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Wordle!');
});

// Rutas adicionales
app.use('/api/auth', require('./routes/auth'));

// Iniciar el servidor en el puerto definido en el archivo .env o 4000 por defecto
app.listen(process.env.PORT || 4000, () => {
  console.log(`API corriendo en puerto ${process.env.PORT || 4000}`);
});
