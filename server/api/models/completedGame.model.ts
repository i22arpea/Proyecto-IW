import mongoose, { Schema, Document } from 'mongoose';

export interface ICompletedGame extends Document {
  userId: mongoose.Types.ObjectId;
  secretWord: string;
  won: boolean;
  attemptsUsed: number;
  createdAt: Date;
}

const CompletedGameSchema = new Schema<ICompletedGame>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    secretWord: { type: String, required: true },
    won: { type: Boolean, required: true },
    attemptsUsed: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICompletedGame>('CompletedGame', CompletedGameSchema);
