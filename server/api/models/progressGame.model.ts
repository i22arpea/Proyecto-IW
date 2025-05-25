import mongoose, { Schema, Document } from 'mongoose';

export interface IProgressGame extends Document {
  userId: mongoose.Types.ObjectId;
  secretWord: string;
  attempts: string[];
  createdAt: Date;
  idioma: string;
  categoria: string;
  longitud: number;
}

const ProgressGameSchema = new Schema<IProgressGame>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    secretWord: { type: String, required: true },
    attempts: { type: [String], required: true },
    idioma: { type: String, required: true },
    categoria: { type: String, required: true },
    longitud: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProgressGame>('ProgressGame', ProgressGameSchema);
