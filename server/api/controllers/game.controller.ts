import { Request, Response } from 'express';
import Game from '../models/game.model';
import CompletedGame from '../models/completedGame.model';
import User from '../models/user.model'; // IMPORTANTE: Añadimos el modelo User
import Word from '../models/word'; // importa tu modelo Word correctamente
import ProgressGame from '../models/progressGame.model';
import UserStats from '../models/stats.model';

// Guardar una partida
export const saveGame = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const { secretWord, attempts, result, duration, attemptsUsed } = req.body;

    const existing = await Game.findOne({ userId });

    if (existing) {
      existing.secretWord = secretWord;
      existing.attempts = attempts;
      existing.result = result;
      existing.duration = duration;
      existing.attemptsUsed = attemptsUsed;
      await existing.save();
    } else {
      const newGame = new Game({ userId, secretWord, attempts, result, duration, attemptsUsed });
      await newGame.save();
    }

    res.status(201).json({ message: 'Partida guardada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar partida', error });
  }
};

// Obtener partida pendiente
export const getPendingGame = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const game = await Game.findOne({ userId });

    if (!game) {
      return res.status(404).json({ message: 'No hay partida pendiente.' });
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener partida pendiente', error });
  }
};

// Obtener partidas guardadas en progreso del usuario autenticado
export const getUserInProgressGames = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const games = await ProgressGame.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener partidas guardadas en progreso', error });
  }
};

// Finalizar partida y pasarla al historial + ACTUALIZAR ESTADÍSTICAS
// Finalizar partida y pasarla al historial + ACTUALIZAR ESTADÍSTICAS
// Finalizar partida y pasarla al historial + ACTUALIZAR ESTADÍSTICAS
export const finishGame = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const { secretWord, won, attemptsUsed } = req.body;

    const completedGame = new CompletedGame({
      userId,
      secretWord,
      won,
      attemptsUsed,
    });

    await completedGame.save();
    await Game.deleteOne({ userId });
    await ProgressGame.deleteOne({ userId }); // Eliminar partida en progreso si existe

    // Actualizar estadísticas en UserStats
    let stats = await UserStats.findOne({ userId });
    if (!stats) {
      stats = new UserStats({ userId });
    }
    stats.totalGames += 1;
    if (won) {
      stats.wins += 1;
      stats.winStreak += 1;
      if (stats.winStreak > stats.maxWinStreak) {
        stats.maxWinStreak = stats.winStreak;
      }
      const attemptKey = attemptsUsed.toString();
      if (['1', '2', '3', '4', '5', '6'].includes(attemptKey)) {
        stats.winsByAttempt[attemptKey] = (stats.winsByAttempt[attemptKey] || 0) + 1;
      }
    } else {
      stats.losses += 1;
      stats.winStreak = 0;
    }
    stats.winRate = stats.totalGames > 0 ? (stats.wins / stats.totalGames) * 100 : 0;
    await stats.save();

    // Actualizar también en User (legacy, para compatibilidad)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado al actualizar estadísticas.' });
    }
    user.totalGames = stats.totalGames;
    user.wins = stats.wins;
    user.losses = stats.losses;
    user.winRate = stats.winRate;
    user.winStreak = stats.winStreak;
    user.maxWinStreak = stats.maxWinStreak;
    user.winsByAttempt = stats.winsByAttempt;
    await user.save();

    res.status(201).json({ message: 'Partida finalizada y estadísticas actualizadas correctamente.' });
  } catch (error) {
    console.error('❌ Error al finalizar partida:', error);
    res.status(500).json({ message: 'Error al finalizar partida', error });
  }
};

// Obtener palabra aleatoria según preferencias del usuario
export const getRandomWord = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const user = await User.findById(userId);

    if (!user || !user.preferences) {
      return res.status(400).json({ error: 'Preferencias del usuario no encontradas.' });
    }

    // Extraer preferencias con fallback por si vienen mal
    const language = user.preferences.language || 'es';
    const category = user.preferences.category || 'general';
    const wordLength = Number(user.preferences.wordLength) || 5;

    console.log('🧪 Buscando palabra con:', {
      language,
      category,
      wordLength,
      typeOfWordLength: typeof wordLength
    });

    const [word] = await Word.aggregate([
      {
        $match: {
          language,
          category,
          length: wordLength
        }
      },
      { $sample: { size: 1 } }
    ]);

    if (!word) {
      console.warn('⚠️ No se encontró ninguna palabra que coincida con:', { language, category, wordLength });
      return res.status(404).json({ error: 'No se encontró ninguna palabra que coincida con las preferencias.' });
    }

    return res.json({ word: word.text });
  } catch (error) {
    console.error('❌ Error al obtener palabra aleatoria:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener historial de partidas del usuario autenticado
export const getUserGameHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const games = await Game.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial de partidas', error });
  }
};

// Obtener estadísticas de partidas del usuario autenticado
export const getUserGameStats = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const games = await Game.find({ userId });
    const total = games.length;
    const wins = games.filter(g => g.result === 'win').length;
    const loses = games.filter(g => g.result === 'lose').length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    res.status(200).json({ total, wins, loses, winRate });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error });
  }
};

// Obtener historial de partidas finalizadas del usuario autenticado
export const getUserCompletedGames = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const games = await CompletedGame.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial de partidas finalizadas', error });
  }
};

// Guardar partida en progreso
export const saveProgressGame = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const { secretWord, attempts, idioma, categoria, longitud } = req.body;

    // Busca si ya existe una partida en progreso para este usuario
    let progressGame = await ProgressGame.findOne({ userId });
    if (progressGame) {
      progressGame.secretWord = secretWord;
      progressGame.attempts = attempts;
      progressGame.idioma = idioma;
      progressGame.categoria = categoria;
      progressGame.longitud = longitud;
      await progressGame.save();
    } else {
      progressGame = new ProgressGame({ userId, secretWord, attempts, idioma, categoria, longitud });
      await progressGame.save();
    }
    res.status(201).json({ message: 'Partida en progreso guardada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar partida en progreso', error });
  }
};