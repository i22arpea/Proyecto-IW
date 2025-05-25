import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';


// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Modelo Word (ajusta la ruta si tienes alias configurados)
import Word from '../api/models/word';

// Palabras de ejemplo
const wordsData = [
  { text: 'perro', language: 'es', category: 'animales' },
  { text: 'gato', language: 'es', category: 'animales' },
  { text: 'caballo', language: 'es', category: 'animales' },
  { text: 'spain', language: 'en', category: 'countries' },
  { text: 'greece', language: 'en', category: 'countries' },
  { text: 'canada', language: 'en', category: 'countries' }
];

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('❌ MONGODB_URI no definida en .env');

    await mongoose.connect(uri);
    console.log('✅ Conectado a MongoDB');

    await Word.deleteMany(); // Limpia colección
    const wordsWithLength = wordsData.map(w => ({
      ...w,
      length: w.text.length
    }));

    await Word.insertMany(wordsWithLength);
    console.log('✅ Palabras insertadas con éxito');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error al insertar palabras:', err);
    process.exit(1);
  }
};

run();
