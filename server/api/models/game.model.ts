import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  userId: mongoose.Types.ObjectId;
  secretWord: string;
  attempts: string[];
}

const GameSchema = new Schema<IGame>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  secretWord: { type: String, required: true },
  attempts: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model<IGame>('Game', GameSchema);
