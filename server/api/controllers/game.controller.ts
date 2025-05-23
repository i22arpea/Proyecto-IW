import { Request, Response } from 'express';
import Game from '../models/game.model';
import CompletedGame from '../models/completedGame.model';

// Guardar una partida
export const saveGame = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const { secretWord, attempts } = req.body;

    const existing = await Game.findOne({ userId });

    if (existing) {
      // Sobrescribimos la partida existente
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

// Finalizar partida y pasarla al historial
export const finishGame = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const { secretWord, won, attemptsUsed } = req.body;

    const completedGame = new CompletedGame({
      userId,
      secretWord,
      won,
      attemptsUsed
    });

    await completedGame.save();

    // Eliminar partida pendiente si existe
    await Game.deleteOne({ userId });

    res.status(201).json({ message: 'Partida finalizada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al finalizar partida', error });
  }
};
