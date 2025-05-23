import { Request, Response } from 'express';
import FriendRequest from '../models/friendRequest.model';
import User from '../models/user.model';
import mongoose from 'mongoose';

// Enviar solicitud de amistad
export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = (req.user as { id: string }).id;
    const { receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'No puedes enviarte una solicitud a ti mismo.' });
    }

    const existing = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId
    });

    if (existing) {
      return res.status(400).json({ message: 'La solicitud ya fue enviada.' });
    }

    const request = new FriendRequest({ sender: senderId, receiver: receiverId });
    await request.save();

    res.status(201).json({ message: 'Solicitud enviada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar solicitud', error });
  }
};

// Aceptar o rechazar solicitud de amistad
export const respondToFriendRequest = async (req: Request, res: Response) => {
  try {
    const receiverId = (req.user as { id: string }).id;
    const { requestId, action } = req.body;

    const request = await FriendRequest.findById(requestId);
    if (!request || request.receiver.toString() !== receiverId) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }

    if (action !== 'accept' && action !== 'reject') {
      return res.status(400).json({ message: 'Acción inválida.' });
    }

    request.status = action === 'accept' ? 'accepted' : 'rejected';
    await request.save();

    if (action === 'accept') {
      await User.findByIdAndUpdate(receiverId, {
        $addToSet: { friends: request.sender }
      });

      await User.findByIdAndUpdate(request.sender, {
        $addToSet: { friends: receiverId }
      });
    }

    res.status(200).json({ message: `Solicitud ${request.status}.` });
  } catch (error) {
    res.status(500).json({ message: 'Error al responder solicitud', error });
  }
};

// Obtener lista de amigos
export const getFriendList = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const user = await User.findById(userId).populate('friends', 'username email');

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener amigos', error });
  }
};

// Ranking entre amigos
export const getFriendsRanking = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string }).id;
    const user = await User.findById(userId).populate('friends');

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const ranking = (user.friends as any[])
      .map((amigo) => ({
        username: amigo.username,
        partidasGanadas: amigo.wins || 0
      }))
      .sort((a, b) => b.partidasGanadas - a.partidasGanadas);

    res.status(200).json(ranking);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ranking', error });
  }
};
