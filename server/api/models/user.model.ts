import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  profileImage?: string; // URL o base64 de la imagen de perfil
  friends: mongoose.Types.ObjectId[];
  friendRequests: mongoose.Types.ObjectId[];
  totalGames: number;
  wins: number;
  losses: number;
  winStreak: number;
  maxWinStreak: number;
  winsByAttempt: Record<string, number>;
  winRate: number; // porcentaje de victorias (wins / totalGames)
  preferences?: {
    theme?: string;
  };
}

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String },
  surname: { type: String },
  profileImage: { type: String, default: '' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalGames: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  winStreak: { type: Number, default: 0 },
  maxWinStreak: { type: Number, default: 0 },
  winsByAttempt: {
    type: Map,
    of: Number,
    default: () => ({ '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 })
  },
  winRate: { type: Number, default: 0 },
  preferences: {
    theme: { type: String, default: 'light' }
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
