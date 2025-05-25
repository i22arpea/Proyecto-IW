import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Word from '../api/models/word';


dotenv.config({ path: path.resolve(__dirname, '../.env') });



const filePath = path.resolve(__dirname, '../api/json/palabras_5.json');
const idioma = 'es';
const categoria = 'general';

const run = async () => {
  try {
    // Leer el archivo JSON
    const raw = fs.readFileSync(filePath, 'utf-8');
    const wordList: string[] = JSON.parse(raw);

    // Formatear palabras para MongoDB
    const formattedWords = wordList.map((text) => ({
      text: text.toLowerCase(),
      language: idioma,
      category: categoria,
      length: text.length
    }));

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Conectado a MongoDB');

    // Insertar en la colección Word
    await Word.deleteMany({ language: idioma, category: categoria, length: 5 }); // limpiar solo las de esa categoría
    await Word.insertMany(formattedWords, { ordered: false });
    console.log(`✅ Palabras insertadas correctamente (ignorando duplicados)`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error al insertar palabras:', err);
    process.exit(1);
  }
};

run();
