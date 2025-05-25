import { Request, Response } from 'express';
import FriendRequest from '../models/friendRequest.model';
import User, { IUser } from '../models/user.model';
import mongoose from 'mongoose';

// Definimos explícitamente el tipo del usuario receptor para tener acceso seguro a ._id
type UserWithId = IUser & { _id: mongoose.Types.ObjectId };

// Enviar solicitud de amistad
export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'Falta el ID del receptor.' });
    }

    // 👇 AQUÍ estaba el error: se debe usar findById
    const receiverUser = await User.findById(receiverId) as UserWithId | null;

    if (!receiverUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (receiverUser._id.toString() === senderId) {
      return res.status(400).json({ message: 'No puedes enviarte una solicitud a ti mismo.' });
    }

    const existing = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverUser._id
    });

    if (existing) {
      return res.status(400).json({ message: 'La solicitud ya fue enviada.' });
    }

    const request = new FriendRequest({
      sender: senderId,
      receiver: receiverUser._id
    });

    await request.save();

    return res.status(201).json({ message: 'Solicitud enviada correctamente.' });
  } catch (error) {
    console.error('Error al enviar solicitud:', error);
    return res.status(500).json({ message: 'Error al enviar solicitud', error });
  }
};

// Aceptar o rechazar solicitud
export const respondToFriendRequest = async (req: Request, res: Response) => {
  try {
    const receiverId = req.user?.id;
    const { requestId, action } = req.body;

    console.log('🔎 requestId recibido:', requestId);
    console.log('🔑 Usuario autenticado:', receiverId);
    console.log('📩 Acción recibida:', action);

    if (!requestId || !action) {
      return res.status(400).json({ message: 'Faltan datos en la solicitud.' });
    }

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }

    if (request.receiver.toString() !== receiverId) {
      return res.status(403).json({ message: 'No tienes permiso para responder esta solicitud.' });
    }

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Acción inválida.' });
    }

    const mappedStatus = action === 'accept' ? 'accepted' : 'rejected';
    request.status = mappedStatus;
    await request.save();

    if (mappedStatus === 'accepted') {
      await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: request.sender } });
      await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: receiverId } });
      console.log('✅ Añadiendo amigos entre:', receiverId, '<->', request.sender);
    }

    return res.status(200).json({ message: `Solicitud ${mappedStatus}.` });
  } catch (error) {
    console.error('❌ Error en respondToFriendRequest:', error);
    return res.status(500).json({ message: 'Error interno al responder solicitud' });
  }
};

// Obtener lista de amigos
export const getFriendList = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).populate('friends', 'username email');

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    console.log('👥 Amigos del usuario:', user.friends);
    return res.status(200).json(user.friends);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener amigos', error });
  }
};

// Ranking entre amigos
export const getFriendsRanking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).populate('friends');

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const ranking = (user.friends as any[])
      .map((amigo) => ({
        username: amigo.username,
        partidasGanadas: amigo.wins || 0
      }))
      .sort((a, b) => b.partidasGanadas - a.partidasGanadas);

    return res.status(200).json(ranking);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener ranking', error });
  }
};

// Obtener solicitudes de amistad recibidas
export const getReceivedFriendRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: 'pending'
    }).populate('sender', 'username email');

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ message: 'Error al obtener solicitudes de amistad' });
  }
};

export const getPendingFriendRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const requests = await FriendRequest.find({ receiver: userId, status: 'pending' })
      .populate('sender', 'username')
      .select('_id sender');

    res.status(200).json(requests);
  } catch (error) {
    console.error('❌ Error al obtener solicitudes pendientes:', error);
    res.status(500).json({ message: 'Error al obtener solicitudes pendientes.' });
  }
};