import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import Word from "./api/models/word";
import palabras from "./api/json/palabras_5.json";

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

console.log("📦 URI desde .env:", process.env.MONGODB_URI);

const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("❌ No se encontró la variable MONGODB_URI en el .env");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("✅ Conectado a MongoDB Atlas");

    const existentes = await Word.find().distinct("text");
    const nuevasPalabras = palabras.filter((p: string) => !existentes.includes(p));

    if (nuevasPalabras.length === 0) {
      console.log("ℹ️ Todas las palabras ya están en la base de datos.");
    } else {
      const docs = nuevasPalabras.map((p: string) => ({ text: p }));
      await Word.insertMany(docs);
      console.log(`✅ ${docs.length} palabras nuevas insertadas.`);
    }

    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error al cargar las palabras:", err);
    process.exit(1);
  });
