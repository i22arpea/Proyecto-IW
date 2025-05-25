import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import * as crypto from 'crypto';

/**
 * Actualizar el perfil del usuario autenticado.
 * Permite modificar email, preferencias o contraseña.
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, surname, profileImage, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (profileImage) user.profileImage = profileImage;

    // Si el usuario desea cambiar su contraseña
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Debes proporcionar la contraseña actual para cambiarla.' });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Contraseña actual incorrecta.' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    return res.json({ message: 'Perfil actualizado correctamente.' });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    return res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

/**
 * Eliminar la cuenta del usuario autenticado.
 * También podrían eliminarse sus partidas si se desea.
 */
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // TODO: También eliminar partidas asociadas si es necesario

    return res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar la cuenta' });
  }
};

//Ver perfil de usuario
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select(
      'username email name surname profileImage preferences'
    );

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    return res.json(user);
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    return res.status(500).json({ message: 'Error al obtener perfil del usuario' });
  }
};
export const recoverPassword = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, newPassword } = req.body;

    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la contraseña', error });
  }
};

// Actualizar preferencias del usuario autenticado

export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;

    const { language, category, wordLength, theme } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const newPrefs: any = { ...user.preferences };

  if (language !== undefined) newPrefs.language = language;
  if (category !== undefined) newPrefs.category = category;
  if (wordLength !== undefined) newPrefs.wordLength = wordLength;
  if (theme !== undefined) newPrefs.theme = theme;

  if (req.body.customColors !== undefined) {
  const { backgroundColor, letterColor } = req.body.customColors || {};
  newPrefs.customColors = {
    backgroundColor: backgroundColor ?? user.preferences?.customColors?.backgroundColor,
    letterColor: letterColor ?? user.preferences?.customColors?.letterColor
  };
}


  user.preferences = newPrefs;


    await user.save();

    res.json({ message: 'Preferencias actualizadas correctamente', preferences: user.preferences });
  } catch (error) {
    console.error('❌ Error al actualizar preferencias:', error);
    res.status(500).json({ error: 'Error al actualizar preferencias' });
  }
};

// Obtener preferencias del usuario autenticado
export const getPreferences = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;

    const user = await User.findById(userId).select('preferences');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ preferences: user.preferences });
  } catch (error) {
    console.error('❌ Error al obtener preferencias:', error);
    res.status(500).json({ error: 'Error al obtener preferencias' });
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: 'Falta el nombre de usuario.' });
  }

  try {
    const user = await User.findOne({ username }).select('_id username');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.status(200).json({ _id: user._id, username: user.username });
  } catch (error) {
    console.error('❌ Error al buscar usuario por nombre:', error);
    return res.status(500).json({ message: 'Error interno al buscar usuario.' });
  }
};
