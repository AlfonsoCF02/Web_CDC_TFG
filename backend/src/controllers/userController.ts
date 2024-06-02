import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Controlador de usuario para la gestión de usuarios en el sistema
 * 
 ******************************************************************************/

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
      { expiresIn: '48h' }
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

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    // Intenta eliminar el usuario utilizando el ID
    const user = await prisma.usuarios.delete({
      where: {
        id: userId
      },
    });

    // Si la eliminación es exitosa, envía una respuesta adecuada
    res.status(200).json({ message: 'Usuario eliminado correctamente.', user: user });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);

    // Prisma arroja un error P2025 si intenta eliminar un usuario que no existe
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'No se encontró el usuario.' });
    }

    // Envía una respuesta de error genérica
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
      const user = await prisma.usuarios.findUnique({
          where: {
              id: userId
          },
          select: {
              id: true,
              name: true,
              surname: true,
              email: true,
              phone: true,
              type: true
              // No incluir el password
          }
      });

      if (user) {
          res.json(user);
      } else {
          res.status(404).json({ message: "Usuario no encontrado" });
      }
  } catch (error) {
      console.error('Error al obtener los detalles del usuario:', error);
      res.status(500).json({ error: 'Error en el servidor.' });
  }
};



export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { name, surname, email, phone, password, type } = req.body;

  try {
    // Verificamos si el correo electrónico ya está en uso por otro usuario
    const existingUser = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      // Si el correo electrónico ya está en uso y no pertenece al usuario que está siendo actualizado
      return res.status(409).json({ error: 'El correo electrónico ya está en uso.' });
    }

    let hashedPassword = password;

    // Verificamos si se proporcionó una nueva contraseña
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Actualizamos el usuario en la base de datos con la contraseña encriptada
    const user = await prisma.usuarios.update({
      where: { id: userId },
      data: {
        name,
        surname,
        email,
        phone: parseInt(phone),
        password: hashedPassword,
        type
      }
    });

    // Enviamos la respuesta JSON con el usuario actualizado
    res.json({ message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    // Manejamos los errores
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};