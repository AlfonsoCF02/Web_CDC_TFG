import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    // Realiza la consulta seleccionando solo los campos deseados
    const categories = await prisma.categorias.findMany({
      select: {
        id: true,        // Asegura que solo se seleccionen los campos necesarios
        categoria: true,
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoria } = req.body;
    const updatedCategory = await prisma.categorias.update({
      where: {
        id
      },
      data: {
        categoria
      }
    });
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(404).json({ error: 'Categoría no encontrada.' });
  }
};


export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.categorias.delete({
      where: {
        id
      }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(404).json({ error: 'Categoría no encontrada.' });
  }
};
