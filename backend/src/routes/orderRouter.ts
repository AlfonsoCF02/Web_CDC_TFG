import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { createOrder, getOrders, updateOrderState, getMyOrders } from '../controllers/orderController';

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * Con la ayuda de la herramienta de inteligencia artificial ChatGPT
 * 
 * @description    Página de gestión de rutas de pedidos del sistema
 * 
 ******************************************************************************/

const router = express.Router();

router.post('/create', createOrder);
router.get('/orders', verifyToken, isAdmin, getOrders);
router.put('/updateState',  verifyToken, isAdmin, updateOrderState);
router.get('/myorders/:id',  verifyToken, getMyOrders);



export default router;
