import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    try {
      const pedidoData = req.body;
  
      // Generar UUID para el pedido y la dirección
      const direccionId = uuidv4();
      const pedidoId = uuidv4();
  
      // Crear la dirección
      await prisma.direcciones.create({
        data: {
          id: direccionId,
          name: pedidoData.name,
          street: pedidoData.street,
          number: pedidoData.number,
          province: pedidoData.province,
          cp: pedidoData.cp,
          country: pedidoData.country,
        },
      });
  
      // Crear el pedido
      await prisma.pedidos.create({
        data: {
          id: pedidoId,
          userDirection: direccionId,
          import: pedidoData.import,
          dateCreation: new Date(),
          state: 'creado',
        },
      });
  
      // Actualizar el stock de cada producto comprado
      await Promise.all(
        pedidoData.productos.map(async (producto: any) => {
          const { productID, quantity } = producto;
  
          // Obtener el producto de la base de datos
          const existingProduct = await prisma.productos.findUnique({
            where: { id: productID },
            select: { stock: true },
          });
  
          // Calcular el nuevo stock después de la compra
          const newStock = existingProduct.stock - quantity;
  
          // Actualizar el stock en la base de datos
          await prisma.productos.update({
            where: { id: productID },
            data: { stock: newStock },
          });
  
          // Crear el registro en la tabla de pedidosProducto
          await prisma.pedidosProducto.create({
            data: {
              id: uuidv4(),
              orderID: pedidoId,
              productID: productID,
              quantity: quantity,
              price: producto.price,
            },
          });
        })
      );
  
      res.status(201).json({ success: true, message: 'Pedido creado correctamente.' });
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
  };
  