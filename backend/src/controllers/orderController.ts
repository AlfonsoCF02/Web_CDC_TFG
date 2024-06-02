import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Controlador de pedidos para la gestión de pedidos en el sistema
 * 
 ******************************************************************************/

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
  
      // Crear el pedido asegurando que userID solo se añade si no es null
      await prisma.pedidos.create({
        data: {
          id: pedidoId,
          userID: pedidoData.userID || undefined,
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
  
      res.status(201).json({ success: true, message: 'Pedido creado correctamente.', orderID: pedidoId });
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
  };
  
  export const getOrders = async (req: Request, res: Response) => {
    try {
      // Obtenemos los pedidos de la base de datos.
      const orders = await prisma.pedidos.findMany({
        select: {
          id: true,
          import: true,
          dateCreation: true,
          dateDelivery: true,
          state: true,
          userDirection: true,
          usuarios: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          },
          direcciones: {
            select: {
              name: true,
              street: true,
              number: true,
              province: true,
              cp: true,
              country: true
            }
          },
          pedidosProducto: {  // Incluye los detalles de los productos del pedido
            select: {
              quantity: true,
              price: true,
              productos: {
                select: {
                  name: true  // Asegúrate de que estos campos están correctos según tu modelo de 'productos'
                }
              }
            }
          }
        }
      });
  
      // Reformatear la respuesta para incluir los detalles del pedido directamente
      const formattedOrders = orders.map(order => ({
        id: order.id,
        import: `${order.import.toFixed(2)}€`,
        dateCreation: order.dateCreation,
        dateDelivery: order.dateDelivery ? order.dateDelivery : 'Pendiente',
        state: order.state,
        userName: order.usuarios ? order.usuarios.name : 'Anónimo',
        userEmail: order.usuarios ? order.usuarios.email : 'Anónimo',
        //userPhone: order.usuarios ? order.usuarios.phone : 'Anónimo',
        ordererName: order.direcciones.name,
        ordererPhone: order.direcciones.number,
        address: order.direcciones ? `${order.direcciones.street}; ${order.direcciones.province} (${order.direcciones.cp}); ${order.direcciones.country}` : 'Dirección desconocida',
        products: order.pedidosProducto.map(pp => ({
          productName: pp.productos && pp.productos.name ? pp.productos.name : 'Desconocido',
          quantity: pp.quantity,
          pricePerUnit: `${pp.price.toFixed(2)}`
        }))
      }));
  
      res.json(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Error en el servidor.' });
    }
  };


  export const updateOrderState = async (req: Request, res: Response) => {
    const { orderId, newState } = req.body;
  
    try {
      // Obtener el pedido por su ID
      const order = await prisma.pedidos.findUnique({
        where: { id: orderId },
      });
  
      if (!order) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
  
      // Determinar la nueva fecha de entrega según el estado
      let newDateDelivery;
      if (newState === 'completado') {
        newDateDelivery = new Date(); // Fecha y hora actual si el estado es 'enviado'
      } else if (newState === 'creado' || newState === 'enviado') {
        newDateDelivery = null; // Null si el estado es 'creado'
      } else {
        newDateDelivery = order.dateDelivery; // Mantener la fecha actual si el estado es 'completado'
      }

      // Actualizar el estado del pedido y la fecha de entrega en una sola llamada
      const updatedOrder = await prisma.pedidos.update({
        where: { id: orderId },
        data: {
          state: newState,
          dateDelivery: newDateDelivery,
        },
      });
  
      // Devolver el pedido actualizado
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  


  export const getMyOrders = async (req: Request, res: Response) => {

    const userId = req.params.id;
  
    try {
      // Obtenemos los pedidos de la base de datos que corresponden al userId proporcionado.
      const orders = await prisma.pedidos.findMany({
        where: { userID: userId },  // Filtra los pedidos para incluir solo aquellos con el userID especificado
        select: {
          id: true,
          import: true,
          dateCreation: true,
          dateDelivery: true,
          state: true,
          userDirection: true,
          usuarios: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          },
          direcciones: {
            select: {
              name: true,
              street: true,
              number: true,
              province: true,
              cp: true,
              country: true
            }
          },
          pedidosProducto: {  // Incluye los detalles de los productos del pedido
            select: {
              quantity: true,
              price: true,
              productos: {
                select: {
                  name: true  // Asegúrate de que estos campos están correctos según tu modelo de 'productos'
                }
              }
            }
          }
        }
      });
  
      // Reformatear la respuesta para incluir los detalles del pedido directamente
      const formattedOrders = orders.map(order => ({
        id: order.id,
        import: `${order.import.toFixed(2)}€`,
        dateCreation: order.dateCreation,
        dateDelivery: order.dateDelivery ? order.dateDelivery : 'Pendiente',
        state: order.state,
        userName: order.usuarios ? order.usuarios.name : 'Anónimo',
        userEmail: order.usuarios ? order.usuarios.email : 'Anónimo',
        //userPhone: order.usuarios ? order.usuarios.phone : 'Anónimo',
        ordererName: order.direcciones.name,
        ordererPhone: order.direcciones.number,
        address: order.direcciones ? `${order.direcciones.street}; ${order.direcciones.province} (${order.direcciones.cp}); ${order.direcciones.country}` : 'Dirección desconocida',
        products: order.pedidosProducto.map(pp => ({
          productName: pp.productos && pp.productos.name ? pp.productos.name : 'Desconocido',
          quantity: pp.quantity,
          pricePerUnit: `${pp.price.toFixed(2)}€`
        }))
      }));
  
      res.json(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Error en el servidor.' });
    }
  };
  