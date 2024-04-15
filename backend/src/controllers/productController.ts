import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


// Función para obtener todos los productos con el nombre de la categoría
export const getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await prisma.productos.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          imageURL: true,
          categorias: {    // Asegúrate de que 'categorias' es el nombre correcto del campo en Prisma
            select: {
              categoria: true  // 'name' debe ser el campo que contiene el nombre de la categoría en tu modelo de 'categorias'
            }
          }
        }
      });
      // Reformatear la respuesta para incluir el nombre de la categoría directamente
      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        imageURL: product.imageURL,
        category: product.categorias ? product.categorias.categoria : 'Sin categoría'  // Manejo en caso de que no haya categoría
      }));
      res.json(formattedProducts);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error en el servidor.' });
    }
  };


export const deleteProduct = async (req, res) => {
    const { id } = req.body; // Extrae el ID del cuerpo de la solicitud
    try {
        await prisma.productos.delete({
            where: { id }
        });
        res.status(204).send(); // Envía una respuesta de éxito sin contenido
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Producto no encontrado.' });
        } else {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Error al eliminar el producto.' });
        }
    }
};


export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, categoryId, price, stock, imageUrl } = req.body;

    if (!name || !categoryId || !price || !stock || !imageUrl) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Comprobar si ya existe un producto con el mismo nombre
    const existingProduct = await prisma.productos.findFirst({
      where: {
        name: name
      }
    });

    if (existingProduct) {
      return res.status(409).json({ error: 'El producto ya existe.' }); // 409 Conflict
    }

    const newProduct = await prisma.productos.create({
      data: {
        id: uuidv4(), // Genera un nuevo UUID para el producto
        name: name,
        categoryID: categoryId,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageURL: imageUrl
      }
    });

    res.json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error interno al crear el producto.' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await prisma.productos.findUnique({
      where: {
        id: productId
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        imageURL: true,
        categoryID: true,
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Formatear la respuesta para incluir el nombre de la categoría directamente
    const formattedProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      imageURL: product.imageURL,
      categoryID: product.categoryID,
    };

    res.json(formattedProduct);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, stock, imageURL, categoryID } = req.body;

    // Realiza la actualización del producto con los datos recibidos del cliente
    const updatedProduct = await prisma.productos.update({
      where: {
        id: productId
      },
      data: {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageURL,
        categoryID
      }
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
