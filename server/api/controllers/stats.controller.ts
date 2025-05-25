import { Request, Response } from 'express';
import User from '../models/user.model';
import CompletedGame from '../models/completedGame.model';
import UserStats from '../models/stats.model';

// GET /api/usuarios/estadisticas
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    let stats = await UserStats.findOne({ userId });
    if (!stats) {
      // Si no existen estadísticas, crearlas con valores iniciales
      stats = new UserStats({ userId });
      await stats.save();
    }
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estadísticas del usuario' });
  }
};

// GET /api/usuarios/historial
export const getUserHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const historial = await CompletedGame.find({ userId })
      .populate('userId', 'username') // Incluye solo el campo username del usuario
      .sort({ createdAt: -1 });

    res.json(historial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el historial de partidas' });
  }
};

// GET /api/ranking/global
export const getGlobalRanking = async (_req: Request, res: Response) => {
  try {
    // solo usuarios con al menos 5 partidas
    const topPlayers = await User.find({ totalGames: { $gte: 5 } })
      .sort({ winRate: -1 })
      .limit(10)
      .select('username winRate totalGames profileImage');

    res.json(topPlayers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el ranking global' });
  }
};
