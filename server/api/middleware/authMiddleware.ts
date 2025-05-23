import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extiende la Request para que req.user tenga un id
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
    };
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;

    // Asegúrate de que el token contiene un campo 'id'
    if (typeof verified !== 'object' || !verified.id) {
      return res.status(403).json({ error: 'Invalid token structure.' });
    }

    req.user = { id: verified.id }; // Normalizado para controladores
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};
