import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  userId: mongoose.Types.ObjectId;
  secretWord: string;
  attempts: string[];
  result: 'win' | 'lose';
  duration: number; // Duration in seconds
  attemptsUsed: number;
}

const GameSchema = new Schema<IGame>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  secretWord: { type: String, required: true },
  attempts: [{ type: String }],
  result: { type: String, enum: ['win', 'lose'], required: true },
  duration: { type: Number, required: true },
  attemptsUsed: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IGame>('Game', GameSchema);
