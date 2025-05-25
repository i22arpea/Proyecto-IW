import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Esquema básico y flexible
const userSchema = new mongoose.Schema({}, { strict: false });

const WordleUser = mongoose.model('User', userSchema, 'users');
const Usuarios = mongoose.model('Usuario', userSchema, 'Usuarios');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Conectado a MongoDB (Wordle)');

    const allUsers = await WordleUser.find();
    console.log(`📦 Usuarios encontrados en 'users': ${allUsers.length}`);

    if (allUsers.length === 0) {
      console.log('⚠️ No hay usuarios para migrar.');
      return process.exit(0);
    }

    for (const user of allUsers) {
      const email = (user as any).email;

      if (!email) continue;

      const exists = await Usuarios.findOne({ email });

      if (!exists) {
        const doc = new Usuarios(user.toObject());
        await doc.save();
        console.log(`✅ Migrado: ${email}`);
      } else {
        console.log(`⚠️ Ya existía: ${email} → omitido`);
      }
    }

    console.log('✅ Migración completada a colección Usuarios.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en la migración:', err);
    process.exit(1);
  }
};

run();
