import express from 'express';
import { verifyToken, isAdmin } from '../authMiddleware';
import { createOrder, getOrders, updateOrderState, getMyOrders } from '../controllers/orderController';

const router = express.Router();


router.post('/create', createOrder);
router.get('/orders', verifyToken, isAdmin, getOrders);
router.put('/updateState',  verifyToken, isAdmin, updateOrderState);
router.get('/myorders/:id',  verifyToken, getMyOrders);



export default router;
