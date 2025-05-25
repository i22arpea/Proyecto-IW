import { Request, Response } from 'express';
import Game from '../models/game.model';
import CompletedGame from '../models/completedGame.model';
import User from '../models/user.model'; // IMPORTANTE: Añadimos el modelo User
import Word from '../models/word'; // importa tu modelo Word correctamente

// Guardar una partida
export const saveGame = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const { secretWord, attempts } = req.body;

    const existing = await Game.findOne({ userId });

    if (existing) {
      existing.secretWord = secretWord;
      existing.attempts = attempts;
      await existing.save();
    } else {
      const newGame = new Game({ userId, secretWord, attempts });
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado al actualizar estadísticas.' });
    }

    user.totalGames += 1;

    if (won) {
      user.wins += 1;
      user.winStreak += 1;

      if (user.winStreak > user.maxWinStreak) {
        user.maxWinStreak = user.winStreak;
      }

      const attemptKey = attemptsUsed.toString();

      if (['1', '2', '3', '4', '5', '6'].includes(attemptKey)) {
        // Asegurarse de que winsByAttempt se trata como un Map
        let winsMap: Map<string, number>;

        if (user.winsByAttempt instanceof Map) {
          winsMap = user.winsByAttempt;
        } else {
          winsMap = new Map(Object.entries(user.winsByAttempt));
        }

        const current = winsMap.get(attemptKey) || 0;
        winsMap.set(attemptKey, current + 1);

        // Convertimos el Map nuevamente a un objeto plano para guardarlo en MongoDB
        user.winsByAttempt = Object.fromEntries(winsMap);
      }
    } else {
      user.losses += 1;
      user.winStreak = 0;
    }

    user.winRate = user.totalGames > 0 ? (user.wins / user.totalGames) * 100 : 0;

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