import mongoose, { Document, Schema } from 'mongoose';

export interface IWord extends Document {
  text: string;
  language: 'es' | 'en';
  category: string;
  length: number;
}

const wordSchema = new Schema<IWord>({
  text: { type: String, required: true, unique: true },
  language: { type: String, enum: ['es', 'en'], required: true },
  category: { type: String, required: true },
  length: { type: Number, required: true }
});

// Middleware para calcular la longitud automáticamente si no se da
wordSchema.pre('validate', function (next) {
  if (this.text && (!this.length || this.length !== this.text.length)) {
    this.length = this.text.length;
  }
  next();
});

export default mongoose.model<IWord>('Word', wordSchema);
