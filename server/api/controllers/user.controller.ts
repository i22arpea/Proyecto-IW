import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';

/**
 * Actualizar el perfil del usuario autenticado.
 * Permite modificar email, preferencias o contraseña.
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { email, preferences, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (email) user.email = email;
    if (preferences) user.preferences = preferences;

    if (newPassword) {
      // Verificar contraseña actual antes de permitir cambio
      if (!currentPassword) {
        return res.status(400).json({ message: 'Debes proporcionar la contraseña actual para cambiarla' });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Contraseña actual incorrecta' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    return res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error(error);
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
