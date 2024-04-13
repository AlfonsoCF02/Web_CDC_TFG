import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';


// Define una interfaz que extiende la interfaz Request de Express para incluir el usuario
interface RequestWithUser extends Request {
  user: any;  // Puedes ser más específico con la estructura de `user` si es necesario
  headers: any;
}

// Middleware para verificar el token JWT
export const verifyToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token no válido' });
  }
};

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user && typeof req.user === 'object' && req.user.type === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acción no permitida. Se requiere rol de administrador.' });
  }
};
