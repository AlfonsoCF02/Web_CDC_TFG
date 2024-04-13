import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
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
      return res.status(404).json({ error: 'Credenciales incorrectas.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
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

export const createUser = async (req: Request, res: Response) => {
  const { name, surname, email, password, phone, type } = req.body;

  try {
    // Comprueba si el usuario ya existe en la base de datos
    const existingUser = await prisma.usuarios.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe.' });
    }

    // Genera un UUID único para el ID del usuario
    const userId = uuidv4();
    
    const salt = await bcrypt.genSalt(10); // Genera un salt para el hash
    const hashedPassword = await bcrypt.hash(password, salt); // Genera el hash de la contraseña

    // Crea el usuario en la base de datos
    const newUser = await prisma.usuarios.create({
      data: {
        id: userId,
        name,
        surname,
        email,
        password: hashedPassword,
        phone: parseInt(phone), 
        type: 'user', 
      },
    });

    // Devuelve los datos del nuevo usuario
    res.status(201).json(newUser);

  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
      // Realiza la consulta seleccionando solo los campos deseados
      const users = await prisma.usuarios.findMany({
          select: {
              id: true,
              name: true,
              surname: true,
              email: true,
              phone: true,
              type: true
          }
      });
      res.json(users);
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error en el servidor.' });
  }
};