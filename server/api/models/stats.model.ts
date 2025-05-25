import mongoose, { Schema, Document } from 'mongoose';

export interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  winStreak: number;
  maxWinStreak: number;
  winsByAttempt: Record<string, number>;
}

const UserStatsSchema = new Schema<IUserStats>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalGames: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  winStreak: { type: Number, default: 0 },
  maxWinStreak: { type: Number, default: 0 },
  winsByAttempt: { type: Object, default: {} },
});

export default mongoose.model<IUserStats>('UserStats', UserStatsSchema);
