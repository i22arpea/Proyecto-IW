import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Word from '../api/models/word';
import User from '../api/models/user.model';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ⚠️ CAMBIA ESTE ID POR EL DE TU USUARIO
const USER_ID = 'PASTE_HERE_YOUR_USER_ID';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Conectado a MongoDB');

    const user = await User.findById(USER_ID);

    if (!user || !user.preferences) {
      console.error('❌ Usuario no encontrado o sin preferencias.');
      return process.exit(1);
    }

    const language = user.preferences.language || 'es';
    const category = user.preferences.category || 'general';
    const wordLength = Number(user.preferences.wordLength) || 5;

    console.log('\n👤 Preferencias del usuario:');
    console.log({ language, category, wordLength });

    const palabras = await Word.find({
      language,
      category,
      length: wordLength
    }).limit(10);

    console.log(`\n📦 Palabras encontradas (${palabras.length}):`);
    palabras.forEach((word, i) => {
      console.log(`#${i + 1}: ${word.text}`);
    });

    if (palabras.length === 0) {
      console.warn('\n⚠️ No se encontraron coincidencias. Verifica los datos del usuario y el contenido de la base de datos.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error en el script:', err);
    process.exit(1);
  }
};

run();
