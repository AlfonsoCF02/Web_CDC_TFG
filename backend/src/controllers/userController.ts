import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
dotenv.config();

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.usuarios.findUnique({ 
        where: { email } 
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const passwordMatch = password === user.password;
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, type: user.type, 
        name: user.name, surname: user.surname, phone: user.phone}, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (error) {
    console.error('Error de inicio de sesión:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};
