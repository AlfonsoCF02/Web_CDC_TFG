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

    // Comprobar si se intenta actualizar a un nombre que ya existe en otra categoría
    const existingCategory = await prisma.categorias.findFirst({
      where: {
        categoria,
        NOT: { id } // Excluye la categoría actual de la búsqueda
      }
    });

    if (existingCategory) {
      return res.status(409).json({ error: 'Ya existe otra categoría con ese nombre.' });
    }

    const updatedCategory = await prisma.categorias.update({
      where: { id },
      data: { categoria }
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error interno al actualizar la categoría.' });
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

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoria } = req.body;

    if (!categoria) {
      return res.status(400).json({ error: 'Debe proporcionar un nombre para la categoría.' });
    }

    // Comprobar si ya existe una categoría con el mismo nombre
    const existingCategory = await prisma.categorias.findFirst({
      where: {
        categoria
      }
    });

    if (existingCategory) {
      return res.status(409).json({ error: 'La categoría ya existe.' }); // 409 Conflict
    }

    const newCategory = await prisma.categorias.create({
      data: {
        id: uuidv4(), // Genera un nuevo UUID para la categoría
        categoria
      }
    });

    res.json(newCategory);
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ error: 'Error interno al crear la categoría.' });
  }
};